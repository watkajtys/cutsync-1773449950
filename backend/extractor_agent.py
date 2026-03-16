import time
import os
import subprocess
import requests
from pocketbase import PocketBase

PB_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")

def get_pb_client():
    return PocketBase(PB_URL)

def process_asset(asset, pb):
    asset_id = getattr(asset, "id", None)
    file_name = getattr(asset, "file", None)
    
    if not asset_id or not file_name:
        print(f"[{asset_id}] Invalid asset record, missing ID or file name.")
        return

    print(f"[{asset_id}] Found pending asset. Changing status to extracting_audio...")
    try:
        pb.collection("assets").update(asset_id, {"processing_status": "extracting_audio"})
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
        response = requests.get(file_url, stream=True)
        response.raise_for_status()
        
        with open(local_video_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        print(f"[{asset_id}] Download complete. Extracting audio...")
        
        subprocess.run([
            "ffmpeg", "-i", local_video_path, 
            "-q:a", "9", "-map", "a", 
            "-y", local_audio_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        print(f"[{asset_id}] Audio extraction complete. Updating status to analyzing...")
        pb.collection("assets").update(asset_id, {"processing_status": "analyzing"})
        
    except Exception as e:
        print(f"[{asset_id}] Error processing asset: {e}")
        try:
            pb.collection("assets").update(asset_id, {"processing_status": "error"})
        except Exception as inner_e:
            print(f"[{asset_id}] Failed to set error status: {inner_e}")

def main():
    print(f"Starting extractor daemon, polling {PB_URL}...")
    pb = get_pb_client()
    
    oneshot = os.getenv("ONESHOT", "false").lower() == "true"
    
    while True:
        try:
            records = pb.collection("assets").get_full_list(
                query_params={
                    "filter": "asset_type='source_clip' && processing_status='pending'"
                }
            )
            
            for record in records:
                process_asset(record, pb)
                
        except Exception as e:
            print(f"Error during polling: {e}")
            
        if oneshot:
            break
            
        time.sleep(5)

if __name__ == "__main__":
    main()
