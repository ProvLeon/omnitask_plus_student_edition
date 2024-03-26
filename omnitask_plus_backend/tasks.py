import base64
import json
import random
from datetime import datetime, timedelta

# User IDs to randomly associate with tasks
user_ids = [
    "c2c6014a-c7a9-4a1e-aa1b-a7aba83bfdcf",
    "c6dadfb0-f330-44ae-a063-0ed27f4e26a2",
    "d87bd8e2-d50e-4e9b-b19c-478e8c9140ce"
]

# Example media content (in a real scenario, this would be file content)
media_content = "This is an example document content."
encoded_media = base64.b64encode(media_content.encode()).decode()

# Generate 30 tasks
tasks = []
for i in range(30):
    task = {
        "user_id": random.choice(user_ids),
        "title": f"Task {i+1}",
        "description": f"This is the description for task {i+1}.",
        "deadline": (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%dT%H:%M:%S'),
        "priority": random.choice(["low", "medium", "high"]),
        "status": random.choice(["pending", "in progress", "completed"]),
        "media": encoded_media
    }
    tasks.append(task)

# Print the generated tasks as JSON
print(json.dumps(tasks, indent=2))

# Headers for the POST request
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"  # Replace YOUR_ACCESS_TOKEN with the actual token
}

# Print the headers
print(json.dumps(headers, indent=2))
