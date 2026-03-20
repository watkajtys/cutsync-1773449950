import time
import os
import subprocess
import urllib.request
import urllib.parse
import logging
import json
import re
import google.generativeai as genai
from pocketbase import PocketBase

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

PB_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "dummy_key"))
pb = PocketBase(PB_URL)

def authenticate():
    admin_email = os.environ.get("PB_ADMIN_EMAIL")
    admin_password = os.environ.get("PB_ADMIN_PASSWORD")
    if admin_email and admin_password:
        try:
            pb.admins.auth_with_password(admin_email, admin_password)
            return True
        except Exception:
            try:
                # Fallback to superusers collection for older pb versions if needed
                pb.collection('_superusers').auth_with_password(admin_email, admin_password)
                return True
            except Exception as inner_e:
                logging.error(f"Failed superuser authentication: {inner_e}")
                return False
    return False

def update_asset_status(asset_id, status):
    logging.info(f"[{asset_id}] Requesting status update to '{status}'")
    try:
        result = pb.collection('assets').update(asset_id, {"processing_status": status})
        logging.info(f"[{asset_id}] Successfully updated status to '{status}'")
        return result
    except Exception as e:
        logging.error(f"[{asset_id}] Error updating status: {e}")
        raise e

def json_to_srt(transcript_json):
    srt_lines = []
    for i, entry in enumerate(transcript_json):
        timestamp = entry.get("timestamp", "00:00:00")
        text = entry.get("text", "")
        if "," not in timestamp:
            timestamp += ",000"
        
        try:
            h, m, s_str = timestamp.split(',')[0].split(':')
            ms_str = timestamp.split(',')[1] if ',' in timestamp else "000"
            h, m, s = int(h), int(m), int(s_str)
            s += 1
            if s >= 60:
                s = 0
                m += 1
            if m >= 60:
                m = 0
                h += 1
            end_timestamp = f"{h:02d}:{m:02d}:{s:02d},{ms_str}"
        except Exception:
            end_timestamp = timestamp
            
        srt_lines.append(f"{i+1}\n{timestamp} --> {end_timestamp}\n{text}")
    return "\n\n".join(srt_lines)

def process_asset(asset):
    asset_id = asset.id
    file_name = asset.file
    
    if not asset_id or not file_name:
        logging.error(f"[{asset_id}] Invalid asset record, missing ID or file name.")
        return

    logging.info(f"[{asset_id}] Found pending asset. Transitioning status: pending -> extracting_audio")
    try:
        update_asset_status(asset_id, "extracting_audio")
    except Exception as e:
        logging.error(f"[{asset_id}] Failed to update status to extracting_audio: {e}")
        return
        
    temp_dir = "/tmp"
    os.makedirs(temp_dir, exist_ok=True)
    local_video_path = os.path.join(temp_dir, f"{asset_id}_{file_name}")
    local_audio_path = os.path.join(temp_dir, f"{asset_id}_audio.mp3")

    try:
        # Download the file
        file_url = pb.get_file_url(asset, file_name)
        
        logging.info(f"[{asset_id}] Downloading {file_name} from {file_url}...")
        
        # Determine if we need to add the auth token to download
        req = urllib.request.Request(file_url)
        if hasattr(pb.auth_store, 'is_valid') and pb.auth_store.is_valid:
            req.add_header('Authorization', pb.auth_store.token)
        elif hasattr(pb.auth_store, 'token') and pb.auth_store.token:
            req.add_header('Authorization', pb.auth_store.token)
            
        with urllib.request.urlopen(req) as response:
            with open(local_video_path, 'wb') as f:
                while True:
                    chunk = response.read(8192)
                    if not chunk:
                        break
                    f.write(chunk)
                
        logging.info(f"[{asset_id}] Download complete. Executing ffmpeg for audio extraction...")
        
        subprocess.run([
            "ffmpeg", "-i", local_video_path, 
            "-q:a", "9", "-map", "a", 
            "-y", local_audio_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        logging.info(f"[{asset_id}] Audio extraction complete. Transitioning status: extracting_audio -> analyzing")
        update_asset_status(asset_id, "analyzing")
        
        logging.info(f"[{asset_id}] Uploading audio to Gemini API...")
        uploaded_file = None
        for attempt in range(5):
            try:
                # We do not pass explicit retry options because we handle retries externally here.
                # If internal tenacity/retry fails, it will throw an exception which we catch.
                uploaded_file = genai.upload_file(local_audio_path)
                break
            except Exception as upload_error:
                logging.warning(f"[{asset_id}] Upload attempt {attempt + 1} failed: {upload_error}")
                if attempt == 4:
                    raise upload_error
                time.sleep(2 ** attempt)

        logging.info(f"[{asset_id}] File uploaded. Waiting for processing to complete...")
        max_retries = 30
        for _ in range(max_retries):
            try:
                # Fetch the updated state from the API
                uploaded_file = genai.get_file(uploaded_file.name)
            except Exception as poll_error:
                logging.warning(f"[{asset_id}] Error polling file state: {poll_error}")
                time.sleep(2)
                continue
            
            if uploaded_file.state.name == "ACTIVE":
                break
            elif uploaded_file.state.name == "FAILED":
                raise Exception("Gemini file processing failed.")
            
            time.sleep(5)
        else:
            raise Exception("Timeout waiting for Gemini file processing.")

        logging.info(f"[{asset_id}] File processing complete. Requesting content generation...")
        
        prompt = """
        You are an Assistant Video Editor. Analyze the provided audio file.
        Please output a strict JSON object with the following schema:
        {
          "transcript": [
            { "timestamp": "00:00:00", "text": "spoken text..." }
          ],
          "cut_suggestions": [
            { "start_timecode": 0, "end_timecode": 5, "cut_reason": "Dead air / Rambling" }
          ]
        }
        Do not include any formatting, markdown, or text outside the JSON object. 
        "start_timecode" and "end_timecode" should be numbers (seconds).
        """
        model = genai.GenerativeModel("gemini-1.5-pro")
        
        response = None
        for attempt in range(5):
            try:
                response = model.generate_content([prompt, uploaded_file], request_options={"timeout": 600})
                break
            except Exception as gen_error:
                logging.warning(f"[{asset_id}] Generation attempt {attempt + 1} failed: {gen_error}")
                if attempt == 4:
                    raise gen_error
                time.sleep(2 ** attempt)

        response_text = response.text.strip()
        # Clean up markdown code blocks if the model included them
        if response_text.startswith("```"):
            response_text = re.sub(r"^```(?:json)?", "", response_text)
            response_text = re.sub(r"```$", "", response_text).strip()
            
        data = json.loads(response_text)
        
        logging.info(f"[{asset_id}] Received structured JSON from Gemini. Saving to Pocketbase...")
        
        # Save transcript
        transcript_data = data.get("transcript", [])
        srt_payload = json_to_srt(transcript_data)
        
        pb.collection("ai_transcripts").create({
            "asset_id": asset_id,
            "raw_text": json.dumps(transcript_data),
            "srt_payload": srt_payload
        })
        
        # Save cut suggestions
        for suggestion in data.get("cut_suggestions", []):
            pb.collection("ai_cut_suggestions").create({
                "asset_id": asset_id,
                "start_timecode": suggestion.get("start_timecode", 0),
                "end_timecode": suggestion.get("end_timecode", 0),
                "cut_reason": suggestion.get("cut_reason", "")
            })
            
        logging.info(f"[{asset_id}] Analysis complete. Transitioning status: analyzing -> ready")
        update_asset_status(asset_id, "ready")
        
    except Exception as e:
        logging.error(f"[{asset_id}] Error processing asset: {e}", exc_info=True)
        try:
            update_asset_status(asset_id, "error")
        except Exception as inner_e:
            logging.error(f"[{asset_id}] Failed to set error status fallback: {inner_e}", exc_info=True)
    finally:
        logging.info(f"[{asset_id}] Cleaning up temporary files...")
        
        for path in [local_video_path, local_audio_path]:
            try:
                os.remove(path)
            except OSError:
                pass
            
        # Also clean up the remote file from Gemini
        if 'uploaded_file' in locals() and uploaded_file is not None:
            for del_attempt in range(5):
                try:
                    genai.delete_file(uploaded_file.name)
                    logging.info(f"[{asset_id}] Deleted file from Gemini: {uploaded_file.name}")
                    break
                except Exception as del_err:
                    logging.warning(f"[{asset_id}] Failed to delete file from Gemini (attempt {del_attempt + 1}): {del_err}", exc_info=True)
                    if del_attempt == 4:
                        break # Give up without crashing after 5 retries
                    time.sleep(2)


def get_pending_assets():
    try:
        records = pb.collection('assets').get_full_list(query_params={
            'filter': "asset_type='source_clip' && processing_status='pending'"
        })
        if records:
            logging.info(f"Found {len(records)} pending assets matching criteria.")
        return records
    except Exception as e:
        logging.error(f"Error polling assets: {e}")
        return []

def main():
    logging.info(f"Starting extractor daemon, polling {PB_URL} for pending assets...")
    
    oneshot = os.getenv("ONESHOT", "false").lower() == "true"
    is_authenticated = False
    
    while True:
        try:
            if not is_authenticated:
                if authenticate():
                    logging.info("Successfully acquired PocketBase admin token.")
                    is_authenticated = True
                else:
                    logging.warning("No PocketBase admin token acquired. API requests may fail. Retrying next cycle...")
            
            records = get_pending_assets()
            
            for record in records:
                process_asset(record)
                
        except Exception as e:
            logging.error(f"Error during polling PocketBase: {e}")
            
        if oneshot:
            logging.info("ONESHOT execution complete. Exiting daemon.")
            break
            
        time.sleep(5)

if __name__ == "__main__":
    main()
