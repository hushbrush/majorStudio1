
//cors issue:(
//okay. leave that. Barring that, let's see what else
//make it all the same height.
//figure out modulartiy first
//filtering:
//1. store the colour in the object
//2. add another tag in the object that in words tells you what the colour is.
//either, I can hover over them to see all the other colours that are that colour,

// const apiKey =    "vou5CccnseKk4Fv0SUZQ0o6HEKAUbxqAAV3cSgS0" //'UIlZKqadOeQus4jccmxUP9WIqyEBKgZw9cfGghuk'; 
// const contentApiUrl = `https://api.si.edu/openaccess/api/v1.0/content/`;
// const searchApiUrl ="https://api.si.edu/openaccess/api/v1.0/search";
let ID;

let idArray = [];
let jsonString = '';

let legcolors=["white", "violet", "blue", "green", "yellow", "orange", "red", "green-blue", "brown", "pink", "gray", "black"];
const svg = d3.select('svg');
const leg = d3.select('leg');
searchApi();
legend();
function searchApi()
{
let url = searchApiUrl + "?api_key=" + apiKey + "&q=" + "online_visual_material:true AND type:edanmdm AND U.S. Stamps";

window
.fetch(url)
.then(res => res.json())
.then(data => {
console.log(data)
  

  let pageSize = 40;
  let numberOfQueries = 4;
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

// // fetching all the data listed under our search and pushing them all into our custom array
// function fetchAllData(url) {
//   window
//   .fetch(url)
//   .then(res => res.json())
//   .then(data => {
//     console.log(data);

//     data.response.rows.forEach(function(n) {
//       addObject(n);
//     });
    
//     jsonString += JSON.stringify(idArray);
//     console.log(idArray);
//     let counter=0;
   

//     if (idArray.length > 0) {
//       sortYear(idArray);
//       for (let i = 0; i <5; i++) 
//       {
//        for(let j=0; j<8; j++)
//         {
//           let x=j*150;
//           let y=i*160;
//           displayImage(idArray[counter].imageLink, x, y );
//           findColor(counter, idArray[counter].imageLink );
//           idArray[counter].tag=tagColor(idArray[counter].color)
//           displaycolor(counter, x,y );
          
//           counter++;
//         }
//       }
//     }
//   })
//   .catch(error => {
//     console.log(error);
//   });
// }
// fetching all the data from a local JSON file (stampData.json) and pushing them all into our custom array
function fetchAllData() {
  // Load the JSON data from stampData.json
  fetch('stampData.json')
    .then(response => response.json())
    .then(data => {
      // Assuming data is an array of objects
      console.log(data);

      data.forEach(function(n) {
        addObject(n); // Add each object to the custom array
      });
    
      // Serialize idArray to JSON string for further use
      jsonString += JSON.stringify(idArray);
      console.log(idArray);

      let counter = 0;

      // If the idArray has data, sort and display them
      if (idArray.length > 0) {
        sortYear(idArray);

        // Display the first 5 rows of 8 items each (assuming you want a grid)
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 8; j++) {
            let x = j * 150;
            let y = i * 160;
            
            // Display image and handle color tagging
            displayImage(idArray[counter].link, x, y);
            findColor(counter, idArray[counter].link);
            idArray[counter].tag = tagColor(idArray[counter].color);
            displaycolor(counter, x, y);
            
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

   
function displayImage(imageUrl, x, y) 
{
  svg.append('image')
    .attr('x', x+20)
    .attr('y', y)
    .attr('height', 110) 
    .attr('href', imageUrl); 
}
   

function displaycolor(index, x, y) {
  svg.append('rect')  // Create a rectangle for each stamp
    .attr('x', x) 
    .attr('y', y) 
    .attr('width', 20) 
    .attr('height', 110)
    .attr('fill', `rgba(${idArray[index].color[0]}, ${idArray[index].color[1]}, ${idArray[index].color[2]}, ${idArray[index].color[3]})`)
    .attr('class', `stamp-rect rect-${index}`)  // Add a unique class for targeting later
    .attr('data-color-tag', idArray[index].tag);  // Store the color tag for filtering
}


function findColor(index, imageUrl)
{
  
   Vibrant.from("https://ids.si.edu/ids/deliveryService?id=ark:/65665/sy79a36feef96074c789e2dda827ab7ca90")
      .getPalette((err, palette) => {
        console.log('in get palette')

          if (err) {
              console.error("Error getting color palette:", err);
              return;
          }

          // Extract dominant colors
          
          var vibrantColor= palette.Vibrant.getHex(); 
          vibrantColor = hexToRGB(vibrantColor);
          idArray[index].color = vibrantColor; 
         
       
        })
       }
//}
function hexToRGB(hex) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
      return [ r, g, b];
  
}
function tagColor(color)
{
  const [r, g, b] = color;
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
      if (r - g <50) return "orange"; // Close to orange
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
    return "yellow?";
  }
// Brown (mix of red and some green, but low blue)
  if (r > 100 && g > 50 && b < 50) {
    return "brown";
  }

  return "unknown"; 
}

function legend() {
  let legx = screen.width - 70;
  let legy = 0;
  let w = 20;
  let h = 15;
  
  for (let i = 0; i < legcolors.length; i++, legy += 3 * h) {
    svg.append('circle')
      .attr('cx', legx)
      .attr('cy', legy)
      .attr('r', w)
      .attr('fill', legcolors[i])
      .on('mouseover', function() {
        let hoveredColor = d3.select(this).attr('fill');  // The color of the hovered circle
        
        // Set all other circles and rects to 40% opacity
        svg.selectAll('circle').attr('opacity', 0.1);
        svg.selectAll('rect').attr('opacity', 0.1);
        svg.selectAll('image').attr('opacity', 0.1);
        
        // Set the hovered circle to 100% opacity
        d3.select(this).attr('opacity', 1);
        
        // Loop through the rectangles and match their color tag
        svg.selectAll('rect')
          .filter(function() {
            console.log(d3.select(this).attr('data-color-tag') == hoveredColor);
            console.log(d3.select(this).attr('data-color-tag'));
            console.log(hoveredColor);
            return d3.select(this).attr('data-color-tag') == hoveredColor;  // Check the custom color tag
          })
          .attr('opacity', 1);  // Set opacity back to 100%
      })
      .on('mouseout', function() {
        // Reset opacity for all circles and rects when mouse leaves the legend
        svg.selectAll('circle').attr('opacity', 1);
        svg.selectAll('rect').attr('opacity', 1);
        svg.selectAll('image').attr('opacity', 1);
      });
  }
}


function sortYear(idArray) 
{
  idArray.sort((a, b) => {
    const yearA = parseInt(a.date, 10);
    const yearB = parseInt(b.date, 10);
    return yearA - yearB;
  });
  
}

