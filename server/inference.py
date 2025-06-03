import json
from BedrockClient import BedrockClient, LLM_MODELS

def main():
    try:
        client = BedrockClient(LLM_MODELS['CLAUDE-3.5'])
        prompt = "Describe what you see in these images in detail."
        image_paths = ['attributes.png']
        
        response = client.call_claude(prompt, image_paths)
        print("\nResponse:", json.dumps(response, indent=2))
        
        with open('response.json', 'w') as f:
            json.dump(response, f, indent=2)
            
    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main()