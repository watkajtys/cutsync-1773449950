import time
import os
import subprocess
import urllib.request
import urllib.parse
import json
import logging
from google import genai
from google.genai import types

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

PB_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")


def get_auth_token():
    admin_email = os.environ.get("PB_ADMIN_EMAIL")
    admin_password = os.environ.get("PB_ADMIN_PASSWORD")
    if not admin_email or not admin_password:
        return None
    
    payload = json.dumps({"identity": admin_email, "password": admin_password}).encode('utf-8')
    try:
        url = f"{PB_URL}/api/collections/_superusers/auth-with-password"
        req = urllib.request.Request(url, data=payload, method="POST")
        req.add_header('Content-Type', 'application/json')
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data.get("token")
    except urllib.error.HTTPError as e:
        try:
            url = f"{PB_URL}/api/admins/auth-with-password"
            req = urllib.request.Request(url, data=payload, method="POST")
            req.add_header('Content-Type', 'application/json')
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                return data.get("token")
        except Exception as inner_e:
            logging.error(f"Failed admin authentication fallback: {inner_e}")
            return None
    except Exception as e:
        logging.error(f"Failed superuser authentication: {e}")
        return None

def update_asset_status(asset_id, status, token=None):
    url = f"{PB_URL}/api/collections/assets/records/{asset_id}"
    data = json.dumps({"processing_status": status}).encode('utf-8')
    req = urllib.request.Request(url, data=data, method="PATCH")
    req.add_header('Content-Type', 'application/json')
    if token:
        req.add_header('Authorization', token)
    logging.info(f"[{asset_id}] Requesting status update to '{status}' at {url}")
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            logging.info(f"[{asset_id}] Successfully updated status to '{status}'")
            return result
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode()
        logging.error(f"[{asset_id}] HTTPError {e.code} updating status at {url}. Payload: {data.decode()}. Response: {err_msg}")
        raise e

def create_pocketbase_record(collection, data, token=None):
    url = f"{PB_URL}/api/collections/{collection}/records"
    payload = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=payload, method="POST")
    req.add_header('Content-Type', 'application/json')
    if token:
        req.add_header('Authorization', token)
    logging.info(f"Creating record in {collection}: {data} at {url}")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode()
        logging.error(f"HTTPError {e.code} creating record in {collection} at {url}. Payload: {payload.decode()}. Response: {err_msg}")
        raise e

def process_asset(asset, token=None):

    asset_id = asset.get("id")
    file_name = asset.get("file")
    
    if not asset_id or not file_name:
        logging.error(f"[{asset_id}] Invalid asset record, missing ID or file name. Record data: {asset}")
        return

    logging.info(f"[{asset_id}] Found pending asset. Transitioning status: pending -> extracting_audio")
    try:
        update_asset_status(asset_id, "extracting_audio", token)
    except Exception as e:
        logging.error(f"[{asset_id}] Failed to update status to extracting_audio: {e}")
        return
        
    temp_dir = "/tmp"
    os.makedirs(temp_dir, exist_ok=True)
    local_video_path = os.path.join(temp_dir, f"{asset_id}_{file_name}")
    local_audio_path = os.path.join(temp_dir, f"{asset_id}_audio.mp3")

    try:
        # Download the file
        file_url = f"{PB_URL}/api/files/assets/{asset_id}/{file_name}"
        
        logging.info(f"[{asset_id}] Downloading {file_name} from {file_url}...")
        req = urllib.request.Request(file_url)
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
        update_asset_status(asset_id, "analyzing", token)

        # Now do the Gemini analysis
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            logging.error(f"[{asset_id}] GEMINI_API_KEY not found in environment, falling back to mock or failing.")
            raise ValueError("Missing GEMINI_API_KEY")
            
        logging.info(f"[{asset_id}] Calling Gemini API for audio analysis...")
        client = genai.Client(api_key=api_key)
        
        # We upload the audio file using the new genai client
        audio_file = client.files.upload(file=local_audio_path)
        
        prompt = """
        Analyze this audio track. Provide a transcript and suggest cuts to improve pacing or remove silent/dead areas.
        Respond ONLY with a valid JSON object following this exact structure:
        {
          "transcript": {
            "raw_text": "Full text here",
            "srt_payload": "1\\n00:00:00,000 --> 00:00:05,000\\nFull text here"
          },
          "cut_suggestions": [
            {
              "start_timecode": 0.5,
              "end_timecode": 2.5,
              "cut_reason": "Long silence"
            }
          ]
        }
        """
        
        response = client.models.generate_content(
            model='gemini-1.5-pro',
            contents=[audio_file, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        
        payload_text = response.text
        logging.info(f"[{asset_id}] Received response from Gemini: {payload_text}")
        
        data = json.loads(payload_text)
        
        transcript_data = data.get("transcript", {})
        cuts = data.get("cut_suggestions", [])
        
        # Save transcript
        create_pocketbase_record("ai_transcripts", {
            "asset_id": asset_id,
            "raw_text": str(transcript_data.get("raw_text", "")),
            "srt_payload": str(transcript_data.get("srt_payload", ""))
        }, token)
        
        # Save cut suggestions
        for cut in cuts:
            create_pocketbase_record("ai_cut_suggestions", {
                "asset_id": asset_id,
                "start_timecode": float(cut.get("start_timecode", 0.0)),
                "end_timecode": float(cut.get("end_timecode", 0.0)),
                "cut_reason": str(cut.get("cut_reason", ""))
            }, token)
            
        logging.info(f"[{asset_id}] Analysis complete. Transitioning status: analyzing -> ready")
        update_asset_status(asset_id, "ready", token)
        
    except Exception as e:
        logging.error(f"[{asset_id}] Error processing asset: {e}")
        try:
            update_asset_status(asset_id, "error", token)
        except Exception as inner_e:
            logging.error(f"[{asset_id}] Failed to set error status fallback: {inner_e}")
    finally:
        # Cleanup temp files
        logging.info(f"[{asset_id}] Cleaning up temporary files...")
        if os.path.exists(local_video_path):
            os.remove(local_video_path)
        if os.path.exists(local_audio_path):
            os.remove(local_audio_path)

def get_pending_assets(token=None):
    filter_expr = urllib.parse.quote("asset_type='source_clip' && processing_status='pending'")
    url = f"{PB_URL}/api/collections/assets/records?filter={filter_expr}&perPage=500"
    logging.debug(f"Polling {url}")
    req = urllib.request.Request(url)
    if token:
        req.add_header('Authorization', token)
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            items = data.get("items", [])
            if items:
                logging.info(f"Found {len(items)} pending assets matching criteria.")
            return items
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode()
        logging.error(f"HTTPError {e.code} polling assets at {url}. Response: {err_msg}")
        return []

def main():
    logging.info(f"Starting extractor daemon, polling {PB_URL} for pending assets...")
    
    oneshot = os.getenv("ONESHOT", "false").lower() == "true"
    token = get_auth_token()
    if token:
        logging.info("Successfully acquired PocketBase admin token.")
    else:
        logging.warning("No PocketBase admin token acquired. API requests may fail if admin privileges are required.")
    
    while True:
        try:
            records = get_pending_assets(token)
            
            for record in records:
                process_asset(record, token)
                
        except Exception as e:
            logging.error(f"Error during polling PocketBase: {e}")
            
        if oneshot:
            logging.info("ONESHOT execution complete. Exiting daemon.")
            break
            
        time.sleep(5)

if __name__ == "__main__":
    main()
