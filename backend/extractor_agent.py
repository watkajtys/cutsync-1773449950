import time
import os
import subprocess
import urllib.request
import urllib.parse
import json

PB_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")

def update_asset_status(asset_id, status):
    url = f"{PB_URL}/api/collections/assets/records/{asset_id}"
    data = json.dumps({"processing_status": status}).encode('utf-8')
    req = urllib.request.Request(url, data=data, method="PATCH")
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def process_asset(asset):
    asset_id = asset.get("id")
    file_name = asset.get("file")
    
    if not asset_id or not file_name:
        print(f"[{asset_id}] Invalid asset record, missing ID or file name.")
        return

    print(f"[{asset_id}] Found pending asset. Changing status to extracting_audio...")
    try:
        update_asset_status(asset_id, "extracting_audio")
    except Exception as e:
        print(f"[{asset_id}] Failed to update status to extracting_audio: {e}")
        return
        
    try:
        # Download the file
        file_url = f"{PB_URL}/api/files/assets/{asset_id}/{file_name}"
        
        temp_dir = "/tmp"
        os.makedirs(temp_dir, exist_ok=True)
        local_video_path = os.path.join(temp_dir, f"{asset_id}_{file_name}")
        local_audio_path = os.path.join(temp_dir, f"{asset_id}_audio.mp3")
        
        print(f"[{asset_id}] Downloading {file_name} from {file_url}...")
        req = urllib.request.Request(file_url)
        with urllib.request.urlopen(req) as response:
            with open(local_video_path, 'wb') as f:
                while True:
                    chunk = response.read(8192)
                    if not chunk:
                        break
                    f.write(chunk)
                
        print(f"[{asset_id}] Download complete. Extracting audio...")
        
        subprocess.run([
            "ffmpeg", "-i", local_video_path, 
            "-q:a", "9", "-map", "a", 
            "-y", local_audio_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        print(f"[{asset_id}] Audio extraction complete. Updating status to analyzing...")
        update_asset_status(asset_id, "analyzing")
        
    except Exception as e:
        print(f"[{asset_id}] Error processing asset: {e}")
        try:
            update_asset_status(asset_id, "error")
        except Exception as inner_e:
            print(f"[{asset_id}] Failed to set error status: {inner_e}")

def get_pending_assets():
    filter_expr = urllib.parse.quote("asset_type='source_clip' && processing_status='pending'")
    url = f"{PB_URL}/api/collections/assets/records?filter={filter_expr}&perPage=500"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        return data.get("items", [])

def main():
    print(f"Starting extractor daemon, polling {PB_URL}...")
    
    oneshot = os.getenv("ONESHOT", "false").lower() == "true"
    
    while True:
        try:
            records = get_pending_assets()
            
            for record in records:
                process_asset(record)
                
        except Exception as e:
            print(f"Error during polling: {e}")
            
        if oneshot:
            break
            
        time.sleep(5)

if __name__ == "__main__":
    main()
