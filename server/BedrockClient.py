
import boto3
import base64
import io
import json
from PIL import Image
from typing import List, Dict, Any
import os


LLM_MODELS = {
    "LLAMA": "us.meta.llama3-2-3b-instruct-v1:0",
    "CLAUDE-3.5": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "CLAUDE-3.7": "anthropic.claude-3-7-sonnet-20250219-v1:0"
}
IMAGE_DIMENSION_LIMIT = 1024

class BedrockClient:
    def __init__(self, model_id: str = LLM_MODELS["CLAUDE-3.5"]):
        self.MODEL_ID = model_id
        self.bedrock = boto3.client('bedrock-runtime')
        self.IMAGES_PATH = "images/"
    
    def normalize_path(self, path: str) -> str:
        normalized = path.replace('\u202f', ' ')
        normalized = normalized.replace('\u00A0', ' ')
        return normalized

    def encode_image(self, image_path: str) -> str:
        try:
            original_dir = os.path.dirname(image_path)
            resized_dir = os.path.join(original_dir, 'resized')
            os.makedirs(resized_dir, exist_ok=True)
            resized_image_path = os.path.join(resized_dir, os.path.basename(image_path))
            with Image.open(image_path) as image:
                width, height = image.size
                scale_factor = IMAGE_DIMENSION_LIMIT / max(width, height)
                if scale_factor < 1:
                    new_height, new_width = int(height * scale_factor), int(width * scale_factor)
                    resized_image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
                else:
                    resized_image = image
                
                resized_image.save(resized_image_path)
                buffered = io.BytesIO()
                resized_image.save(buffered, format=image.format)
                return buffered.getvalue()
        except Exception as e:
            raise Exception(f"Error encoding image {image_path}: {str(e)}")

    def prepare_message(self, prompt: str, image_paths: List[str]) -> Dict[str, Any]:
        messages = []
        for image_path in image_paths:
            try:
                encoded_image = self.encode_image(image_path)
                messages.append({
                        "role": "user",
                        "content": [{
                            "image": {
                                "format": "png",
                                "source": {
                                    "bytes":encoded_image
                                }
                            }
                        }]
                    })
            except Exception as e:
                raise Exception(f"Error processing image {image_path}: {str(e)}")
        
        if messages and prompt:
            messages[-1]["content"].append({
                "text": prompt
            })
        elif prompt:
            messages.append({"role": "user", "content": [{ "text": prompt }]})
        return messages

    def call_claude(self, prompt: str, image_paths: List[str]) -> Dict[str, Any]:
        try:
            messages = self.prepare_message(prompt, image_paths)
            
            response = self.bedrock.converse(
                modelId=self.MODEL_ID,
                messages=messages,
                inferenceConfig={
                    "maxTokens": 8192,
                    "temperature": 0.7,
                    "topP": 0.9
                }
            )
            
            response_text = response.get("output", {}).get("message", {}).get("content", [{}])[0].get("text", "")
            
            return {
                'response': response_text,
                'metadata': {
                    'input_tokens': response.get('usage', {}).get('inputTokens', {}),
                    'output_tokens': response.get('usage', {}).get('outputTokens', {}),
                    'latency': response.get('metrics', {}).get('latencyMs', {})
                }
            }
            
        except Exception as e:
            raise Exception(f"Error calling Claude: {str(e)}")
