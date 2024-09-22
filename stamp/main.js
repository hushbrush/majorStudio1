
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
const colorRanges = {
  red:    { min: [200, 0, 0], max: [255, 100, 100] },
  orange: { min: [200, 100, 0], max: [255, 165, 0] },
  yellow: { min: [200, 200, 0], max: [255, 255, 100] },
  green:  { min: [0, 200, 0], max: [100, 255, 100] },
  blue:   { min: [0, 0, 200], max: [100, 100, 255] },
  violet: { min: [100, 0, 200], max: [200, 100, 255] },
  black:  { min: [0, 0, 0], max: [50, 50, 50] },
  white:  { min: [200, 200, 200], max: [255, 255, 255] },
};


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
          //tagColor(idArray[index].color)
          
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
              //.attr('width', 160) // allows to render in height but without the 
              .attr('href', imageUrl); // Use URL directly in SVG

        
      }
   



function displaycolor(index, x, y)
{ 
  svg.append('rect')
  .attr('x', x) // X coordinate of the rectangle (same as image)
  .attr('y', y) // Y coordinate of the rectangle (same as image)
  .attr('width', 20) // Half the width of the image
  .attr('height', 110) // Same height as the image
  .attr('fill', 'blue')
 // .attr('fill', `rgba(${idArray[index].color[0]}, ${idArray[index].color[1]}, ${idArray[index].color[2]}, ${idArray[index].color[3]})`)//might have to change this if the colour comes in hex eventually.
 
}


function findColor(index, imageUrl)
{

  //this stuff will give me the real colour but is flagging cors issues, working without that for now
  //Using Vibrant directly with the image URL
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imageUrl; // + '?not-from-cache-please';

  const v = new Vibrant(img);
  console.log(v.getPalette());
  //  Vibrant.from(imageUrl)
  //     .getPalette((err, palette) => {
  //       console.log('in get palette')

  //         if (err) {
  //             console.error("Error getting color palette:", err);
  //             return;
  //         }

          // Extract dominant and muted colors
          //const vibrantColor =  [Math.ceil(Math.random()*255), Math.ceil(Math.random()*255), Math.ceil(Math.random()*255), 1]; //palette.Vibrant.getHex();
          //const mutedColor =  palette.Muted.getHex();
         // idArray[index].color = vibrantColor; // Add the color property
       
      //   })
      //  }
}

    

function tagColor(color)
{
  for (const [name, range] of Object.entries(colorRanges)) {
    const [r, g, b] = color;

    if (
        r >= range.min[0] && r <= range.max[0] &&
        g >= range.min[1] && g <= range.max[1] &&
        b >= range.min[2] && b <= range.max[2]
    ) {
        return name;
    }
}
return "unknown"; // or any default value
}



function sortYear(idArray)
{
  idArray.sort((a, b) => {
    const yearA = parseInt(a.date, 10);
    const yearB = parseInt(b.date, 10);
    return yearA - yearB;
  });
  
}

