
//filtering:
//1. store the colour in the object
//2. add another tag in the object that in words tells you what the colour is.
//either, I can hover over them to see all the other colours that are that colour,

let ID;

let idArray = [];
let jsonString = '';

let legcolors=["white", "violet", "blue", "green", "yellow", "orange", "red", "green-blue", "brown", "pink", "gray", "black"];
const svg = d3.select('svg');
const leg = d3.select('leg');
searchApi();
legend();
function searchApi() {
  
  fetch('stampData.json')
    .then(res => res.json())
    .then(data => {
      console.log(data);

    
      data.forEach(function(n) {
        addObject(n);
      });

      
      jsonString += JSON.stringify(idArray);
      console.log(idArray);

      let counter = 0;

      
      if (idArray.length > 0) {
        sortYear(idArray);

        
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 8; j++) {
            let x = j * 190;
            let y = i * 160;

            
            displayImage(idArray[counter].imageLink, x, y);
            //findColor(counter, idArray[counter].imageLink);
            //idArray[counter].tag = tagColor(idArray[counter].color);
            //displaycolor(counter, x, y);

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
  
   Vibrant.from(imageUrl)
      .getPalette((err, palette) => {
        
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

  
  if (max < 50) return "black";

  if (diff < 30 && max > 200) return "white";
  if (diff < 30) return "gray";


  if (r > g && r > b) {
    if (g > b) {
      if (r - g <50) return "orange"; // Close to orange
     // if (80<(r - g) <90) return "brown";
    return "red";
    }
    return "pink";
  }

  if (g > r && g > b) {
    if (b > r) {
      return "green-blue"; 
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

