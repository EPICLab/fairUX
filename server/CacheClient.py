import os
import json
import hashlib
from typing import Optional, Dict, Any

class CacheClient:
    def __init__(self, cache_dir: str = './cache'):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)

    def get_cached_data(self, cache_key: str, subfolder: str = '') -> Optional[Dict[str, Any]]:
        try:
            cache_dir = os.path.join(self.cache_dir, subfolder)
            cache_file = os.path.join(cache_dir, f"{cache_key}.json")
            if os.path.exists(cache_file):
                with open(cache_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error reading cache: {str(e)}")
        return None

    def set_cached_data(self, cache_key: str, data: Dict[str, Any], subfolder: str = '') -> None:
        try:
            cache_dir = os.path.join(self.cache_dir, subfolder)
            os.makedirs(cache_dir, exist_ok=True)
            cache_file = os.path.join(cache_dir, f"{cache_key}.json")
            with open(cache_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error writing cache: {str(e)}")

def create_hash(*args: Any) -> str:
    string_args = [json.dumps(arg, sort_keys=True) if isinstance(arg, (dict, list)) else str(arg) 
                  for arg in args]
    combined = ''.join(string_args)
    
    # Create hash
    return hashlib.md5(combined.encode()).hexdigest()