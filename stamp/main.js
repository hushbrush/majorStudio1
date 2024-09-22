
//cors issue:(
//okay. leave that. Barring that, let's see what else
//make it all the same height.
//figure out modulartiy first
//filtering:
//1. store the colour in the object
//2. add another tag in the object that in words tells you what the colour is.

const apiKey = 'UIlZKqadOeQus4jccmxUP9WIqyEBKgZw9cfGghuk'; 
const contentApiUrl = `https://api.si.edu/openaccess/api/v1.0/content/`;
const searchApiUrl ="https://api.si.edu/openaccess/api/v1.0/search";
let ID;

let idArray = [];
let jsonString = '';



function searchApi()
{
let url = searchApiUrl + "?api_key=" + apiKey + "&q=" + "online_visual_material:true AND type:edanmdm AND U.S. Stamps";

window
.fetch(url)
.then(res => res.json())
.then(data => {
console.log(data)
  

  let pageSize = 10;
  let numberOfQueries = 1;
    //Math.ceil(data.response.rowCount / pageSize);//not working with all the data rn
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
      for (let i = 0; i < 5; i++) 
      {
       for(let j=0; j<2; j++)
        {
          let x=i*160;
          let y=j*150;
          displayImage(idArray[counter].imageLink, x, y );
          findColor(counter, idArray[counter].imageLink );
          displaycolor(counter, x,y );
          console.log(x+":"+idArray[counter].color+":"+tagColor(idArray[counter].color));
          
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
if(objectData.content.indexedStructured.place) {
    currentPlace = objectData.content.indexedStructured.place[0];
  }
  
if(objectData.content.freetext.date) {
    stamp_date = objectData.content.freetext.date[0].content;
  }
  
img_link = objectData.content.descriptiveNonRepeating.online_media.media[0].guid;

if(img_link){
  idArray.push({
    id: objectData.id,
    title: objectData.title,
    imageLink: img_link,
    date: stamp_date
  })
}

}
const svg = d3.select('svg');
searchApi();

   
function displayImage(imageUrl, x, y) {
            // Append image directly to SVG
          svg.append('image')
              .attr('x', x+20)
              .attr('y', y)
              .attr('height', 110) // Adjust size
              .attr('href', imageUrl); // Use URL directly in SVG

        
      }
   



function displaycolor(index, x, y)
{ 
  svg.append('rect')
  .attr('x', x) // X coordinate of the rectangle (same as image)
  .attr('y', y) // Y coordinate of the rectangle (same as image)
  .attr('width', 20) // Half the width of the image
  .attr('height', 110) // Same height as the image
  .attr('fill', `rgba(${idArray[index].color[0]}, ${idArray[index].color[1]}, ${idArray[index].color[2]}, ${idArray[index].color[3]})`)//might have to change this if the colour comes in hex eventually.
 
}


function findColor(index, imageUrl)
{
  //this stuff will give me the real colour but is flagging cors issues, working without that for now
  //Using Vibrant directly with the image URL  
  //  Vibrant.from(imageUrl)
  //     .getPalette((err, palette) => {
  //       console.log('in get palette')

  //         if (err) {
  //             console.error("Error getting color palette:", err);
  //             return;
  //         }

          // Extract dominant and muted colors
          const vibrantColor =  [Math.ceil(Math.random()*255), Math.ceil(Math.random()*255), Math.ceil(Math.random()*255), 1]; //shoudl be palette.Vibrant.getHex(); but will get to that later
          //const mutedColor =  palette.Muted.getHex();
         idArray[index].color = vibrantColor; // Add the color property
       
      //   })
      //  }
}

    

function tagColor(color)
{
  const [r, g, b] = color;
  
  // Calculate the differences between the color components
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  // If max is very small, it's black or close to black
  if (max < 50) return "black";

  // If diff is very small, it's grayscale (could be white, gray, or close to white)
  if (diff < 30 && max > 200) return "white";
  if (diff < 30) return "gray";

  // If red is dominant
  if (r > g && r > b) {
    if (g > b) {
      if (r - g <50) return "yellow"; // Close to orange
     // if (80<(r - g) <90) return "brown";
    return "red";
    }
    return "pink";
  }

  // If green is dominant
  if (g > r && g > b) {
    if (b > r) {
      return "green-blue"; // Cyan is green + blue
    }
    return "green";
  }

  // If blue is dominant
  if (b > r && b > g) {
    if (r > g) {
      return "violet"; // Close to violet/purple
    }
    return "blue";
  }

  // If it's a mixture of red and green (yellow)
  if (r > 200 && g > 200 && b < 100) {
    return "orange?";
  }

  // Brown (mix of red and some green, but low blue)
  if (r > 100 && g > 50 && b < 50) {
    return "brown";
  }

  return "unknown"; // Default for undefined colors
}




function sortYear(idArray)
{
  idArray.sort((a, b) => {
    const yearA = parseInt(a.date, 10);
    const yearB = parseInt(b.date, 10);
    return yearA - yearB;
  });
  
}

