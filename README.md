# fairUX

**fairUX** is a system that detects cognitive-inclusivity bugs in user interfaces using AI-powered reasoning grounded in Inclusive Design Research

AWS Bedrock and AWS CLI setup needs to be done before running the server and the client locally.

## Step 1 - AWS Bedrock & CLI Setup

To use LLMs like Claude or LLaMA via Amazon Bedrock, you **must configure AWS CLI** and **use your own access tokens**.

### 1. Install AWS CLI

Follow the official instructions: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

### 2. Configure AWS Credentials

Run the following and enter your credentials:
```bash
aws configure
```

You will need:
- **AWS Access Key ID**
- **AWS Secret Access Key**
- **Default Region** (e.g., `us-east-1`)
- **Output Format** (e.g., `json`)

> Ensure your IAM user has `bedrock:InvokeModel` permission and access to Amazon Bedrock.

### 3. Enable Bedrock Access

Make sure your AWS account has access to Amazon Bedrock and has requested access to the desired models: https://console.aws.amazon.com/bedrock/home

---

## Step 2 - Install git and clone the repository (maybe this is already set on your machine)

Follow the official instructions to install git based on the operating system you have: https://git-scm.com/downloads

Clone the repository running the command:
```
git clone https://github.com/EPICLab/fairUX.git
cd fairUX
```


---

## Step 3 - LLM Configuration
1) If using Bedrock: Update the following in `server/BedrockClient.py`):

```python
LLM_MODELS = {
    "LLAMA-3": "us.meta.llama3-2-3b-[xyz]",
    "CLAUDE-3.5": "anthropic.claude-3-5-sonnet-[xyz]-v[x]:0",
    "CLAUDE-3.7": "anthropic.claude-3-7-sonnet-[xyz]-v[x]:0"
}
```

Here [xyz] are placeholders. To use these models, you **must provide your own AWS credentials (i.e. model IDs)** and ensure your account is authorized for the corresponding Bedrock models. 

2) **[Optional]** You can use GPT Model Family Invocation via OpenAI API **[Optional]** 
As an alternative to Amazon Bedrock, you can configure this system to use OpenAI’s GPT models via the OpenAI API.

### ⚠️ Important Note:
If you choose to use GPT models via the OpenAI API instead of Bedrock, you **might need to adjust how responses are parsed** in the reasoning pipeline. OpenAI's reasoning model response format may differ from Bedrock's. For all models that are natively available through Bedrock (e.g., Claude, LLaMA), no changes are needed.

- Install OpenAI Python SDK in your virtual environment 
  ```bash
  pip install openai
  ```

- You need an OpenAI account and API key: https://platform.openai.com/account/api-keys

- The OpenAI API key must be set as an environment variable so the system can authenticate API requests.

```bash
export OPENAI_API_KEY="your-api-key-here"
```

> On Windows (CMD):
```cmd
set OPENAI_API_KEY=your-api-key-here
```

- Sample GPT API Invocation

Below is an example of how to invoke GPT-4 from Python using the OpenAI SDK. You can adapt this logic similar to call_claude function in your `BedrockClient.py` if switching to OpenAI:

```python
import os
from openai import OpenAI

openai.api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-4.1",
    messages=[
        {
            "role": "user",
            "content": "Write a one-sentence bedtime story about a unicorn."
        }
    ]
)

print(completion.choices[0].message.content)
```

Check out OpenAI platform for more details: https://platform.openai.com/docs/guides/text?api-mode=chat


## Step 4 -  Local Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create and activate a virtual environment:
   ```
    python3.11 -m venv venv_py311
    source venv_py311/bin/activate   # On Windows: venv_py311\Scripts\activate
   ```

3. Install Python dependencies:
   ```
   pip3 install -r requirements.txt
   python3 -m playwright install
   ```
4. Update path locations in `server/app.py`
     ```
     UPLOAD_FOLDER = '<path_to_project_directory>/fairUX/server/images/screenshots'
     REPORT_FOLDER = '<path_to_project_directory>/fairUX/server/reports'
     ```  
5. Start the server:
   ```bash
   python3 app.py
   ```

---

## Step 5 -  Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Ensure Node.js and npm are installed.  
   If not, install from: https://nodejs.org/ 

3. Install required packages:
   ```bash
   npm install
   ```

4. Add UUID types for development:
   ```bash
   npm i --save-dev @types/uuid
   ```

5. Start the frontend development server:
   ```bash
   npm start
   ```
6. You are all set. You can access the tool in your browser:
  ```bash
    http://localhost:3000/
   ```
---



