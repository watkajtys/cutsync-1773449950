import time
import os
import subprocess
import urllib.request
import urllib.parse
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

PB_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")

def update_asset_status(asset_id, status):
    url = f"{PB_URL}/api/collections/assets/records/{asset_id}"
    data = json.dumps({"processing_status": status}).encode('utf-8')
    req = urllib.request.Request(url, data=data, method="PATCH")
    req.add_header('Content-Type', 'application/json')
    logging.info(f"[{asset_id}] Requesting status update to '{status}' at {url}")
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode())
        logging.info(f"[{asset_id}] Successfully updated status to '{status}'")
        return result

def process_asset(asset):
    asset_id = asset.get("id")
    file_name = asset.get("file")
    
    if not asset_id or not file_name:
        logging.error(f"[{asset_id}] Invalid asset record, missing ID or file name. Record data: {asset}")
        return

    logging.info(f"[{asset_id}] Found pending asset. Transitioning status: pending -> extracting_audio")
    try:
        update_asset_status(asset_id, "extracting_audio")
    except Exception as e:
        logging.error(f"[{asset_id}] Failed to update status to extracting_audio: {e}")
        return
        
    try:
        # Download the file
        file_url = f"{PB_URL}/api/files/assets/{asset_id}/{file_name}"
        
        temp_dir = "/tmp"
        os.makedirs(temp_dir, exist_ok=True)
        local_video_path = os.path.join(temp_dir, f"{asset_id}_{file_name}")
        local_audio_path = os.path.join(temp_dir, f"{asset_id}_audio.mp3")
        
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
        update_asset_status(asset_id, "analyzing")
        
    except Exception as e:
        logging.error(f"[{asset_id}] Error processing asset during download or ffmpeg extraction: {e}")
        try:
            update_asset_status(asset_id, "error")
        except Exception as inner_e:
            logging.error(f"[{asset_id}] Failed to set error status fallback: {inner_e}")

def get_pending_assets():
    filter_expr = urllib.parse.quote("asset_type='source_clip' && processing_status='pending'")
    url = f"{PB_URL}/api/collections/assets/records?filter={filter_expr}&perPage=500"
    logging.debug(f"Polling {url}")
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        items = data.get("items", [])
        if items:
            logging.info(f"Found {len(items)} pending assets matching criteria.")
        return items

def main():
    logging.info(f"Starting extractor daemon, polling {PB_URL} for pending assets...")
    
    oneshot = os.getenv("ONESHOT", "false").lower() == "true"
    
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
