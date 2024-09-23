
//filtering:
//1. store the colour in the object
//2. add another tag in the object that in words tells you what the colour is.
//either, I can hover over them to see all the other colours that are that colour,
//scroll
//its ok its ok its ok
//lets try taking the colour wihtout vibrant
//it might work

let ID;
let idArray = [];
let jsonString = '';
let size = 110;
let legcolors=["white", "violet", "blue", "green", "yellow", "orange", "red", "green-blue", "brown", "pink", "gray", "black"];
const svg = d3.select('#svg');
const leg = d3.select('leg');
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

        
        for (let i = 0; i < idArray.length/221; i++) {
          for (let j = 0; j < 7; j++) {
            let x = j * size*2;
            let y = i * (size+35);

            //scaling(size);
            displayImage(idArray[counter].imageLink, x, y, size);
            
             findColor(counter, idArray[counter].imageLink);
            
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
  
function displayImage(imageUrl, x, y, imageheight) 
{
  svg.append('image')
    .attr('x', x+20)
    .attr('y', y)
    .attr('height', imageheight) 
    .attr('href', imageUrl); 
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
  await delay(6000);
   Vibrant.from(imageUrl)
      .getPalette((err, palette) => {
        
         if (err) {
              console.error("Error getting color palette:", err);
              return;
          }
      var vibrantColor= palette.Vibrant.getHex(); 
      vibrantColor = hexToRGB(vibrantColor)
          
     //var vibrantColor= [Math.ceil(Math.random()*255), Math.ceil(Math.random()*255), Math.ceil(Math.random()*255)];
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

