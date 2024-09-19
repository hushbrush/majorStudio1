
   const apiKey = ''; 
   const contentApiUrl = `https://api.si.edu/openaccess/api/v1.0/content/`;
   const searchApiUrl ="https://api.si.edu/openaccess/api/v1.0/search";
   let ID;

   let idArray = [];
let jsonString = '';

   //search api
   function searchApi()
   {
    let url = searchApiUrl + "?api_key=" + apiKey + "&q=" + "online_visual_material:true AND type:edanmdm AND U.S. Stamps";
    console.log(url);
    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
    console.log(data)
      
    
      let pageSize = 1000;
      let numberOfQueries = Math.ceil(data.response.rowCount / pageSize);
      console.log(numberOfQueries)
      for(let i = 0; i < numberOfQueries; i++) {
        if (i == (numberOfQueries - 1)) {
        
          searchAllURL = url + `&start=${i * pageSize}&rows=${data.response.rowCount - (i * pageSize)}`;
        } else {
          searchAllURL = url + `&start=${i * pageSize}&rows=${pageSize}`;
        }
        console.log(searchAllURL)
        fetchAllData(searchAllURL);
      
      }
    })
    .catch(error => {
      console.log(error);
    })
}

// fetching all the data listed under our search and pushing them all into our custom array
function fetchAllData(url) {
  window
  .fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log(data);

    data.response.rows.forEach(function(n) {
      addObject(n);
    });
    
    jsonString += JSON.stringify(idArray);
    console.log(idArray);
    
    if (idArray.length > 0) {
      sortYear(idArray);
      
      for (let i = 0; i < 5; i++) {
        let rgbArray = [];
        displayImage(idArray[i].imageLink);
        const Sentiment = require('sentiment');
        const sentiment = new Sentiment(idArray[i].title);
        const result = sentiment.analyze();
        console.log(result);  // { score: 3, comparative: 0.75, ... }
      }
    }
  })
  .catch(error => {
    console.log(error);
  });
}



function addObject(objectData) {  
  

  let currentPlace = "";
  if(objectData.content.indexedStructured.place) {
    currentPlace = objectData.content.indexedStructured.place[0];
  }
  let date = "";
  if(objectData.content.freetext.date) {
    stamp_date = objectData.content.freetext.date[0].content;
  }
 img_link = objectData.content.descriptiveNonRepeating.online_media.media[0].guid;
  

idArray.push({
    id: objectData.id,
    title: objectData.title,
    imageLink: img_link,
    date: stamp_date
  })
}


searchApi();

   
function displayImage(imageUrl) {
  const imgContainer = document.getElementById('image-container');

  // Create an img element and set its src attribute to the image URL
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'Image from API';
  img.style.maxWidth = '10%'; // Ensure the image fits within the container
  // Append the image to the container
  svg.appendChild(img);
}

function sortYear(idArray)
{
  idArray.sort((a, b) => {
    const yearA = parseInt(a.date, 10);
    const yearB = parseInt(b.date, 10);
    return yearA - yearB;
  });
  
}

//   const img = new Image();
        //   img.crossOrigin = 'Anonymous'; // Handle CORS if necessary
        //   const proxyUrl = 'https://cors-anywhere.herokuapp.com/corsdemo'
        //   img.src = proxyUrl+idArray[i].imageLink;
        //   img.onload = () => {
        //     // Once the image is loaded, draw it on the canvas
        //     const canvas = document.getElementById('canvas');
        //     const ctx = canvas.getContext('2d');
            
        //     // Set canvas size to match the image size
        //     canvas.width = img.width;
        //     canvas.height = img.height;

        //     // Draw the image on the canvas
        //     ctx.drawImage(img, 0, 0);
        //     console.log("image drawn");

        //     // Get the image data
        //     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //     const data = imageData.data;
        //     console.log("data:" +data);

           
        //     // Process each pixel
        //     for (let i = 0; i < data.length; i += 4) {
        //         const r = data[i];
        //         const g = data[i + 1];
        //         const b = data[i + 2];
        //        const a=data[i + 3];
        //         // Store the RGB values
        //         console.log("color: " +r+" "+g+" "+b);
        //         rgbArray.push({ r, g, b, a });
        //     }

      
        //   }
        //   const color = `rgb(${rgbArray[0].r}, ${rgbArray[0].g}, ${rgbArray[0].b})`;
        //   const svg = d3.select("svg");
        //   svg.append("rect")
        //   .attr("x", 50) // X position
        //   .attr("y", 50) // Y position
        //   .attr("width", 10)  // Width of the rectangle
        //   .attr("height", 10) // Height of the rectangle
        //   .attr("stroke-width", 3)
        //   .attr("stroke", "black")
        //   .attr("fill", blue ) // Fill color of the rectangle
        //   .attr("fill", color ); // Fill color of the rectangle

              



        //     // Log the RGB values to the console
        //     console.log(rgbArray);
        // };

        // img.onerror = (error) => 
        // {
        //     console.error('Error loading image:', error);
        // };