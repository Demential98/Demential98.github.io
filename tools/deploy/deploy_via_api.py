import requests
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

REPO = os.environ.get("REPO")

if not REPO:
    print("❌ Please set REPO in a .env file")
    exit(1)

WORKFLOW_ID = os.environ.get("WORKFLOW_NAME")
if not WORKFLOW_ID:
    print("❌ Please set WORKFLOW_NAME in a .env file")
    exit(1)

GITHUB_TOKEN = os.environ.get("GH_TOKEN")
if not GITHUB_TOKEN:
    print("❌ Please set GH_TOKEN in a .env file")
    exit(1)

headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

# Get branches
print("📥 Fetching branches...")
branches_url = f"https://api.github.com/repos/{REPO}/branches"
resp = requests.get(branches_url, headers=headers)

if resp.status_code != 200:
    print(f"❌ Error fetching branches: {resp.status_code}\n{resp.text}")
    exit(1)

branches = [b["name"] for b in resp.json()]
for idx, b in enumerate(branches):
    print(f"{idx + 1}. {b}")

choice = input("🔢 Select a branch to deploy: ")
branch = branches[int(choice) - 1]

# Trigger workflow_dispatch
print(f"🚀 Triggering deploy workflow for branch: {branch}")

dispatch_url = f"https://api.github.com/repos/{REPO}/actions/workflows/{WORKFLOW_ID}/dispatches"

USE_MASTER = os.environ.get("USE_MASTER")

if not USE_MASTER or USE_MASTER=="YES":
    print("Using Workflow of Master branch")
    resp = requests.post(dispatch_url, headers=headers, json={
        "ref": "master",              # <--- Always trigger on master
        "inputs": {
            "branch": branch          # <--- Still deploy from the selected branch
        }
    })

else:
    print(f"Using Workflow of {branch} branch")
    resp = requests.post(dispatch_url, headers=headers, json={
        "ref": branch,
        "inputs": {
            "branch": branch
        }
    })
if resp.status_code == 204:
    print("✅ Deploy triggered successfully!")
else:
    print(f"❌ Failed to trigger deploy: {resp.status_code}\n{resp.text}")
