<<<<<<< HEAD
lab02_smithsonian_apilab02_smithsonian_api# majorStudio1
=======
# majorStudio1![TRIASSIC 1](https://github.com/user-attachments/assets/f2831213-b4c7-49e0-a390-c69f0685c7e2)
![TRIASSIC 2](https://github.com/user-attachments/assets/131b4d4d-c2b3-445d-9f20-11aabd018420)
![TRIASSIC 3](https://github.com/user-attachments/assets/a6417aa6-eeee-4abf-a655-8a83a0bbc9c5)
>>>>>>> 180f68e429ac566652f80d4adf664df6081b0179
>>>>>>>
>>>>>>> !(![ui_stamp_dataviz3](https://github.com/user-attachments/assets/c1f01d63-5023-4cab-a04f-db61c51e11d5)
)
>>>>>>> 
>>>>>>> ![The first 100 stamps in the collection(In the order of their dates)]
>>>>>>> 

<img width="1728" style="transform: rotate(90deg) alt="stamps2-min" src="https://github.com/user-attachments/assets/99ac92c8-8120-4838-9816-772f1de97a2b">
<img width="1728" alt="stamps-min" src="https://github.com/user-attachments/assets/c13f244e-1700-4d49-a736-4b2f0936f8d2">






Lisa: 
It looks like the command may not have been executed properly, as there’s an incomplete "pipe cursh quote" at the end of the shell script. This indicates that there may have been a typing or formatting issue when running the script. Let me guide you through the process to ensure everything works.

### Steps to Run the Script Correctly:

1. **Save the script**: Make sure your entire shell script is saved properly in a file, for example, `downloadImages.sh`. There shouldn’t be any incomplete commands or syntax at the end of the file.

2. **Make the script executable**: After saving the script, you will need to give it the necessary execution permissions. Run the following command in the terminal:
    ```bash
    chmod +x downloadImages.sh
    ```

3. **Execute the script**: Run the script by calling it in your terminal:
    ```bash
    ./downloadImages.sh
    ```

4. **Check the output**: If the script runs successfully, you should see the images being downloaded to your specified directory: `/Users/toDownloadImages/stampImageDownloads/images`.

### Correct and Clean Version of the Shell Script:

```bash
#!/bin/bash

# Define your JSON file path
JSON_FILE="./stampData.json" # Change this to your JSON file path
DOWNLOAD_FOLDER="/Users/toDownloadImages/stampImageDownloads/images"

# Create the download directory if it doesn't exist
mkdir -p "$DOWNLOAD_FOLDER"

# Parse JSON, sort by date, and download images
jq -c '.[] | select(.date and .date[0].content and .id) | {url: .link, id: .id, date: .date[0].content}' "$JSON_FILE" | \
sort -t: -k2 | \
while IFS= read -r item; do
    # Extract the details from the JSON object
    URL=$(echo "$item" | jq -r '.url')
    ID=$(echo "$item" | jq -r '.id')
    DATE=$(echo "$item" | jq -r '.date')

    # Create a valid filename using the ID
    FILE_NAME="${ID}.jpg"
    FILE_PATH="$DOWNLOAD_FOLDER/$FILE_NAME"

    # Download the image using curl
    curl -L -o "$FILE_PATH" "$URL" || echo "Failed to download: $URL"
    
    echo "Downloaded: $FILE_PATH"
done
```

### Notes:
- The script uses `jq` to extract `url`, `id`, and `date` from the JSON file, sorts the entries by date, and downloads the images.
- Make sure the JSON file is formatted correctly and available at the specified path.











A3:

![1](https://github.com/user-attachments/assets/2c272e2d-bb1f-4f5d-91ec-c1a716f385bf)

![2](https://github.com/user-attachments/assets/15e0f49d-0e56-4ac9-8163-75636b25f0c1)

![3](https://github.com/user-attachments/assets/41c46069-632e-40dd-b87e-77486bba16d2)


![WHAT MAKES IT 2](https://github.com/user-attachments/assets/bd77459c-81ce-4f89-8660-3e3d92e6625b)


![WHAT MAKES IT 3](https://github.com/user-attachments/assets/a2c63972-c56d-4eb8-a358-41a3fa4bf9e4)


![WHAT MAKES IT 4](https://github.com/user-attachments/assets/11fae476-e3c4-4d80-8225-257dad7e406a)


![WHAT MAKES IT 5](https://github.com/user-attachments/assets/c2c3ad2d-84e7-4540-b526-e63aebe9af53)

