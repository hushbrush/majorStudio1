



let image_name;
let ID;
let idArray = [];
let jsonString = '';
let size = 110;
let legcolors=["violet", "blue", "green", "yellow", "red", "beige"];
const svg = d3.select('#svg');

callEverything();
legend();



function animateStackedBar() {
  const stackData = prepareStackedData(idArray);
  const { xScale, yScale } = defineScales(stackData, idArray);

  // Hide current grid elements
  svg.selectAll('image').attr('opacity', 0);

  // Transition to the stacked bar layout
  svg.selectAll('rect')
      .data(stackData)
      .transition()
      .duration(1000)
      .attr('x', (d, i) => xScale(d.data.year))  // X-axis based on year
      .attr('y', d => yScale(d[1]))  // Stack vertically
      .attr('height', d => yScale(d[0]) - yScale(d[1]))  // Adjust height
      .attr('width', xScale.bandwidth());  // Adjust width to band scale
  
  // Draw the axes if necessary
  drawAxes(xScale, yScale);
}




function callEverything() {
  
  fetch('stampData.json')
    .then(res => res.json())
    .then( async data => {
      console.log(data);
      data.forEach(function(n) {
        
        addObject(n);
      });

      jsonString += JSON.stringify(idArray);
      console.log(idArray);

      let counter = 0;
      
      if (idArray.length > 0) {
      sortYear(idArray);
      for (let i = 0; i < 215; i++) 
          {
            for (let j = 0; j < 8; j++) 
              {
              let x = j * size*1.9;
              let y = i * (size+35);
              await findColor(counter, './images/'+idArray[counter].id+'.jpg');//the colour is there inside this function but not there outside, why?
              console.log("colour:"+idArray[counter].color+"at counter" +counter);
              idArray[counter].tag = tagColor(idArray[counter].color);
              displayImage(idArray[counter].imageLink, x, y, size, idArray[counter].tag, idArray[counter].title, idArray[counter].date );
              displaycolor(counter, x, y);
              counter++;
            
          
      }
    }
}})
    .catch(error => {
      console.log(error);
    });
}




async function addObject(objectData) {  
  
  let stamp_date = null;
  if (objectData.date && objectData.date.length > 0) {
    stamp_date = objectData.date[0].content;  
  }
  let img_link = objectData.link;

  if(img_link){
    idArray.push({
      id: objectData.id,
      title: objectData.title,
      imageLink: objectData.link,
      date: stamp_date
    })
  }
  
}

async function displayImage(imageUrl, x, y, imageheight, colorTag, title, date) {
  const image = svg.append('image')
      .attr('x', x + 20)
      .attr('y', y)
      .attr('height', imageheight)
      .attr('href', imageUrl)
      .attr('data-color-tag', colorTag)
      .on('mouseover', function (event) {
          const tooltip = d3.select('#tooltip');
          tooltip.html(`Title: ${title}<br>Date: ${date}`) // Set tooltip content
              .style('visibility', 'visible') // Show tooltip
              .style('left', (event.pageX + 5) + 'px') // Position tooltip
              .style('top', (event.pageY - 28) + 'px');
      })
      .on('mousemove', function (event) {
          d3.select('#tooltip')
              .style('left', (event.pageX + 5) + 'px') // Update position
              .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
          d3.select('#tooltip')
              .style('visibility', 'hidden'); // Hide tooltip
      });
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

function findColor(index, imageUrl) {
  return new Promise((resolve, reject) => {
    

      setTimeout(() => {
          console.log("Finding color for:", imageUrl);  // Test the asynchronous flow
          console.log("at:", index)
          
          Vibrant.from(imageUrl)
              .getPalette((err, palette) => {
                
                 if (err) {
                      console.error("Error getting color palette at "+imageUrl, err);
                      
                      return;
                  }
              var vibrantColor= palette.Vibrant.getHex(); 
          vibrantColor = hexToRGB(vibrantColor);

          // Assign the color to idArray
          idArray[index].color = vibrantColor;

          console.log("Color found:", vibrantColor);  // To confirm this runs before continuing

          // Resolve the promise to signal completion
          resolve();
      }, 1000);  
  });
})}


function hexToRGB(hex) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
      return [ r, g, b];
  
}

function tagColor(color)
{
  console.log(color);
  const [r, g, b] = color;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  if(((r+g+b)>600)&&b<100)
    return "beige"
  if (max < 70) return "black";

  if (diff < 30 && max > 200) return "beige";
  // if (diff < 30) return "gray";


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

  return "black"; 
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

async function imageExists(imageUrl) {
  try {
    // Try to fetch the image with a GET request
    const response = await fetch(imageUrl);
    
    // If the response is OK (status 200), the image exists
    return response.ok;
  } catch (error) {
    // If there's an error (e.g., network error), return false
    console.error("Error checking image:", error);
    return false;
  }
}


function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
