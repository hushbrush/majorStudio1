
//edit design in terms of h1, and highlightin the filteration
//if hover on image, tooltip with details



let ID;
let idArray = [];
let jsonString = '';
let size = 110;
let legcolors=["violet", "blue", "green", "yellow", "red", "gray",];
const svg = d3.select('#svg');
callEverything();
legend();
function callEverything() {
  
  fetch('stampData.json')
    .then(res => res.json())
    .then( data => {
      console.log(data);

    
      data.forEach(function(n) {
        addObject(n);
      });

      
      jsonString += JSON.stringify(idArray);
      console.log(idArray);

      let counter = 0;
      //findColor(counter, idArray[counter].imageLink);
      
      
      if (idArray.length > 0) {
        sortYear(idArray);

        
        for (let i = 0; i < 220; i++) {
          for (let j = 0; j < 8; j++) {
            let x = j * size*1.9;
            let y = i * (size+35);

            //scaling(size);
            findColor(counter, idArray[counter].imageLink);
            idArray[counter].tag = tagColor(idArray[counter].color);
            displayImage(idArray[counter].imageLink, x, y, size, idArray[counter].tag);
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
function scaling()
{
 // switch size;
 //if a button is pressed, increase size by 20px
 //if another button is pressed, decrease size by 20px
}
function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
function addObject(objectData) {  
  
  let stamp_date = null;
  if (objectData.date && objectData.date.length > 0) {
    stamp_date = objectData.date[0].content;  // Assuming 'date' contains an array of objects with 'content'
  }
  
  let img_link = objectData.link;

if(img_link){
  idArray.push({
    id: objectData.id,
    title: objectData.title,
    imageLink: img_link,
    date: stamp_date
  })
}

}
  
function displayImage(imageUrl, x, y, imageheight, colorTag ) 
{
  svg.append('image')
    .attr('x', x+20)
    .attr('y', y)
    .attr('height', imageheight) 
    .attr('href', imageUrl)
    .attr('data-color-tag', colorTag);  // Add color tag to the image element
}
   
function displaycolor(index, x, y) {
  

  svg.append('rect')  // Create a rectangle for each stamp
    .attr('x', x) 
    .attr('y', y) 
    .attr('width', 20) 
    .attr('height', 110)
    .attr('fill', `rgba(${idArray[index].color[0]}, ${idArray[index].color[1]}, ${idArray[index].color[2]}, 1)`)
    .attr('class', `stamp-rect rect-${index}`) 
    .attr('data-color-tag', idArray[index].tag);  
   
}

async function findColor(index, imageUrl)
{
  // await delay(6000);
  //  Vibrant.from(imageUrl)
  //     .getPalette((err, palette) => {
        
  //        if (err) {
  //             console.error("Error getting color palette:", err);
  //             return;
  //         }
  //     var vibrantColor= palette.Vibrant.getHex(); 
  //     vibrantColor = hexToRGB(vibrantColor)
          
     var vibrantColor= [Math.ceil(Math.random()*255), Math.ceil(Math.random()*255), Math.ceil(Math.random()*255)];
      idArray[index].color = vibrantColor; 
    //     })
}

function hexToRGB(hex) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
      return [ r, g, b];
  
}

function tagColor(color)
{
  //console.log(color);
  const [r, g, b] = color;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  
  if (max < 50) return "black";

  if (diff < 30 && max > 200) return "white";
  if (diff < 30) return "gray";


  if (r > g && r > b) {
    if (g > b) {
      if (r - g <50) return "yellow"; // Close to orange
      if (80<(r - g) <90) return "red";
    return "red";
    }
    return "red";
  }

  if (g > r && g > b) {
    if (b > r) {
      return "green"; 
    }
    return "green";
  }


  if (b > r && b > g) {
    if (r > g) {
      return "violet"; // Close to violet/purple
    }
    return "blue";
  }


  if (r > 200 && g > 200 && b < 100) {
    return "yellow?";
  }

  if (r > 100 && g > 50 && b < 50) {
    return "brown";
  }

  return "unknown"; 
}

function legend() {

  let legx = 240;
  let legy = 0;
  let w = 30;
  let h = 30;
  
  const leg = d3.select('#leg')
  .attr('viewBox', '0 0 1080 200');
  
 

  leg.append('text')
  .attr('x', 20)  // Center the text horizontally (adjust as necessary)
  .attr('y', 20)   // Position the text above the circles
  .attr('text-anchor', 'left')  // Center align the text
  .attr('font-size', '24px')  // Set the font size
  .attr('fill', 'lightGray')  // Set the font color
  .text('Filter by colours:');  // The text content


  for (let i = 0; i < legcolors.length; i++, legx+= 1.5*h) {
    // if(i==4)
    // {
    //   legy += 1.5*h;
    //   legx=20;
    // }
    leg.append('rect')
      .attr('x', legx)
      .attr('y', legy)
      .attr('width', w)
      .attr('height', h)
      .attr('fill', legcolors[i])
      .on('mouseover', function() {
        
          let hoveredColor = d3.select(this).attr('fill');  // The color of the hovered circle
        
          // Set all other circles and rects to 40% opacity
          svg.selectAll('rect').attr('opacity', 0.1);
          svg.selectAll('image').attr('opacity', 0.1);
          
          // Set the hovered circle to 100% opacity
          d3.select(this).attr('opacity', 1);
          
          // Loop through the rectangles and match their color tag
          svg.selectAll('rect')
            .filter(function() {
              
              return d3.select(this).attr('data-color-tag') == hoveredColor;  // Check the custom color tag
            })
            .attr('opacity', 1);  // Set opacity back to 100%
          svg.selectAll('image')
            .filter(function() {
              return d3.select(this).attr('data-color-tag') == hoveredColor;  // Use 'data-color-tag' instead of 'tag'
            })
            .attr('opacity', 1);  // Set opacity back to 100%
        
       
        
      })
      .on('mouseout', function() {
        
           // Reset opacity for all circles and rects when mouse leaves the legend
        svg.selectAll('rect').attr('opacity', 1);
        svg.selectAll('image').attr('opacity', 1);
        
       
        
      })
      .on('click', function() {
        
        const clickedColor = d3.select(this).attr('fill');
        
        // Toggle selection
        if (selectedColor == clickedColor) {
          
            // Reset the selection
            selectedColor = null;
            svg.selectAll('rect').attr('opacity', 1);
            svg.selectAll('image').attr('opacity', 1);
        
        } else {
            // Set the new selected color
            selectedColor = clickedColor;
            
            // Update opacity for selected color
            svg.selectAll('rect').attr('opacity', d => d3.select(this).attr('data-color-tag') === selectedColor ? 1 : 0.1);
            svg.selectAll('image').attr('opacity', d => d3.select(this).attr('data-color-tag') === selectedColor ? 1 : 0.1);
        }
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

