#!/bin/bash

# Define your JSON file path
JSON_FILE="./stampData.json" # Change this to your JSON file path
DOWNLOAD_FOLDER="/Users/toDownloadImages/stampImageDownloads/downloadimages"

# Create the download directory if it doesn't exist
mkdir -p "$DOWNLOAD_FOLDER"

# Parse JSON, sort by date, and download images
jq -c '.[] | select(.date and .date[0].content) | {url: .link, title: .title, date: .date[0].content}' "$JSON_FILE" | \
sort -t: -k2 | \
while IFS= read -r item; do
    # Extract the details from the JSON object
    URL=$(echo "$item" | jq -r '.url')
    TITLE=$(echo "$item" | jq -r '.title')
    DATE=$(echo "$item" | jq -r '.date')

    # Create a valid filename
    FILE_NAME="${DATE}_${TITLE// /_}.jpg"
    FILE_PATH="$DOWNLOAD_FOLDER/$FILE_NAME"

    # Download the image using curl or wget
    curl -L -o "$FILE_PATH" "$URL" || echo "Failed to download: $URL"
    
    echo "Downloaded: $FILE_PATH"
done
