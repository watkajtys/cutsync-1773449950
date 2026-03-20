import time
import os
import subprocess
import urllib.request
import urllib.parse
import logging
from pocketbase import PocketBase

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

PB_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")
pb = PocketBase(PB_URL)

def authenticate():
    admin_email = os.environ.get("PB_ADMIN_EMAIL")
    admin_password = os.environ.get("PB_ADMIN_PASSWORD")
    if admin_email and admin_password:
        try:
            pb.admins.auth_with_password(admin_email, admin_password)
            return True
        except Exception as e:
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
        
    except Exception as e:
        logging.error(f"[{asset_id}] Error processing asset: {e}")
        try:
            update_asset_status(asset_id, "error")
        except Exception as inner_e:
            logging.error(f"[{asset_id}] Failed to set error status fallback: {inner_e}")
    finally:
        # Cleanup video temp file but keep audio for Gemini
        logging.info(f"[{asset_id}] Cleaning up temporary video file...")
        if os.path.exists(local_video_path):
            os.remove(local_video_path)
        # Note: We do NOT delete local_audio_path here because it is consumed by the Gemini agent in Phase 6.

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
    if authenticate():
        logging.info("Successfully acquired PocketBase admin token.")
    else:
        logging.warning("No PocketBase admin token acquired. API requests may fail if admin privileges are required.")
    
    while True:
        try:
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
