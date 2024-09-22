
//step 1: find the dominant colour
//step 2: display it in a rectangle vertically half of the stamp
//step 3: figure out how we'll filter it after that. That's step 3. Don't get ahead of yourself. Just do step 1 and 2 for now. You're good. chill chill chill chill chill chill chill.


   const apiKey = 'UIlZKqadOeQus4jccmxUP9WIqyEBKgZw9cfGghuk'; 
   const contentApiUrl = `https://api.si.edu/openaccess/api/v1.0/content/`;
   const searchApiUrl ="https://api.si.edu/openaccess/api/v1.0/search";
   let ID;

   let idArray = [];
let jsonString = '';

   //search api
   function searchApi()
   {
    let url = searchApiUrl + "?api_key=" + apiKey + "&q=" + "online_visual_material:true AND type:edanmdm AND U.S. Stamps";
    
    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
    console.log(data)
      
    
      let pageSize = 1000;
      let numberOfQueries = 5;
       //Math.ceil(data.response.rowCount / pageSize);
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
    let counter=0;
    if (idArray.length > 0) {
      sortYear(idArray);
      for (let i = 0; i < 10; i++) 
      {
       for(let j=0; j<10; j++)
        {
          displayImage(idArray[counter].imageLink, i*160, j*110 );
          
          counter++;
        }
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
// Convert to HTTPS if necessary
// if (img_link.startsWith('http:')) {
//   img_link = img_link.replace('http:', 'https:');
// }

idArray.push({
    id: objectData.id,
    title: objectData.title,
    imageLink: img_link,
    date: stamp_date
  })
}

const svg = d3.select('svg');

searchApi();

   
function displayImage(imageUrl, x, y) {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  fetch(proxyUrl + imageUrl, {
    method: 'GET',
    mode: 'no-cors',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',  // example header
      'Content-Type': 'application/json' // example header
    }
  })
  
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.blob(); // Get the response as a Blob
  })
  .then(blob => {
      const img = new Image();
      img.src = URL.createObjectURL(blob); // Create an object URL for the Blob

      img.onload = function() {
          // Getting dominant colour
          Vibrant.from(img).getPalette((err, palette) => {
              if (err) {
                  console.error("Error getting color palette:", err);
                  return;
              }

              const vibrantColor = palette.Vibrant.getHex();
              const mutedColor = palette.Muted.getHex();

              svg.append('image')
                  .attr('x', x)
                  .attr('y', y)
                  .attr('width', img.width / 10) // Adjust if needed
                  .attr('height', img.height / 10) // Adjust if needed
                  .attr('href', img.src); // Use 'href' for image source in SVG

              svg.append('rect')
                  .attr('x', x) // X coordinate of the rectangle (same as image)
                  .attr('y', y) // Y coordinate of the rectangle (same as image)
                  .attr('width', (img.width / 10) / 2) // Half the width of the image
                  .attr('height', img.height / 10) // Same height as the image
                  .attr('fill', vibrantColor) // Fill color
                  .attr('stroke', mutedColor) // Optional stroke
                  .attr('stroke-width', 2); // Optional stroke width
          });
      };
  })
  .catch(error => {
      console.error('Error loading image:', error);
  });
}




function sortYear(idArray)
{
  idArray.sort((a, b) => {
    const yearA = parseInt(a.date, 10);
    const yearB = parseInt(b.date, 10);
    return yearA - yearB;
  });
  
}

