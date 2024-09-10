/*
  Exercise 3
  DOM manipulation with vanilla JS
*/

// Task
// What does DOM stand for?

// Task
// Open the file index.html in your browser. Open the index.html file in VS Code, right-click the tab and select "Open in Browser"
// If you are working locally, navigate to the excercise directory and start a python http server `python3 -m http.server 900`, press Control-c to stop the server 

// Task
// Delete the div with the class rectangle from index.html and refresh the preview.

// Task
// What does the following code do?
const viz = document.body.querySelector(".viz");
const button = document.body.querySelector("#button");

console.log(viz, viz.children);

const addChildToViz = () => {
  const newChild = document.createElement("div");
  newChild.className = "rectangle";
  newChild.style.height = Math.random() * 100 + "px";
  viz.appendChild(newChild);
};

// Task
// Modify index.html to make this event listener work
button.addEventListener("click", addChildToViz);

// Task
// Where can you see the results of the console.log below? How is it different from in previous exercises?

function drawIrisData(thewidth, theheight) {

  const viz = document.querySelector(".viz");
  const newChild = document.createElement("div");
    newChild.className = "rectangle";
    newChild.style.height = theheight*10+'px';
    newChild.style.width = thewidth*10+'px';
    viz.appendChild(newChild);

    
}


window
  .fetch("./iris_json.json")
  .then(data => data.json())
  .then(data => {
    data.forEach(item=>{
      drawIrisData(item.petalwidth, item.petallength );
      console.log("Drawing rectangle for item:", item);

    });
    
});


// Task
// Modify the code above to visualize the Iris dataset in the preview of index.html.
// Feel free to add additional CSS properties in index.html, or using JavaScript, as you see fit.
