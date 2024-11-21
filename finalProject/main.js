


let primaryColour = "#f0ead6", secondaryColour = "#000", tertiaryColour = "#00A0B0";


let i, cleanedData, indexedData=[], bucketedData=[]; 
let  maxIndex;
  // Calculate the maximum index for each factor
  const maxcondition = 35;
  const maxrarity = 35;
  const maxprintingtechniques = 20;
  const maxedition = 10;
  const maxhistoricalsignificance= 30;
  const maxfamousfigures = 10;
  const maxdenomination = 20;
  const maxperforation = 12;
  const maxdate = 30;
  const maxcollection = 5;
  const maxprinter = 5;
async function loadData() {
    try {
        const data = await d3.json('data/data.json');
        cleanedData = analyseData(data);
        
    } catch (error) {
        console.error('Error loading the JSON data:', error);
    }
}

function analyseData(data) {
    if (!Array.isArray(data)) {
        console.error('Expected an array but received:', data);
        return [];
    }

    const cleanedData = [];

    data.forEach(function (element) {
        // Initialize the obj with default values
        let obj = {
            title: element.title ? element.title : "NA",
            date: element.date ? element.date : "NA",
            thumbnail: element.thumbnail?.[0]?.thumbnail || "NA",
            link: element.link || "NA",
            printer: "NA",
            depicts: "NA",
            description: "NA",
            medium: "NA",
            dimensions: "NA",
            place: element.place?.toString() || "NA",
            collection: "NA",
            topics: element.topic || "NA"
        };

        // Extract information from `element.printer`
        if (element.printer) {
            for (let i = 0; i < element.printer.length; i++) {
                if (element.printer[i].label === "Depicts") {
                    obj.depicts = obj.depicts === "NA" 
                        ? element.printer[i].content 
                        : obj.depicts + "; " + element.printer[i].content;
                }
                if (element.printer[i].label === "Printer") {
                    obj.printer = obj.printer === "NA" 
                        ? element.printer[i].content 
                        : obj.printer + "; " + element.printer[i].content;
                }
            }
        }

        // Extract information from `element.description`
        if (element.description) {
            for (let i = 0; i < element.description.length; i++) {
                obj.description = obj.description === "NA" 
                    ? element.description[i].content 
                    : obj.description + "; " + element.description[i].content;
            }
        }

        // Extract information from `element.collection`
        if (element.collection) {
            for (let i = 0; i < element.collection.length; i++) {
                obj.collection = obj.collection === "NA" 
                    ? element.collection[i].content 
                    : obj.collection + "; " + element.collection[i].content;
            }
        }

        // Extract information from `element.mediumDimensions`
        if (element.mediumDimensions) {
            for (let i = 0; i < element.mediumDimensions.length; i++) {
                if (element.mediumDimensions[i].label === "Medium") {
                    obj.medium = obj.medium === "NA" 
                        ? element.mediumDimensions[i].content 
                        : obj.medium + "; " + element.mediumDimensions[i].content;
                }
                if (element.mediumDimensions[i].label === "Dimensions") {
                    obj.dimensions = obj.dimensions === "NA" 
                        ? element.mediumDimensions[i].content 
                        : obj.dimensions + "; " + element.mediumDimensions[i].content;
                }
            }
        }

        // Extract original price from `obj.title`
        const regex = /(\$?\d+(\.\d+)?[c\$]?)/;
        if (regex.test(obj.title)) {
            const match = obj.title.match(regex)[0];
            if (match.includes('$')) {
                const dollars = parseFloat(match.replace(/[^\d.-]/g, ''));
                const cents = Math.round(dollars * 100);
                obj.orgPrice = cents + "c";
            } else {
                obj.orgPrice = match;
            }
        } else if (obj.title.includes('cent')) {
            const match = obj.title.match(/\d+/);
            obj.orgPrice = match ? match[0] + "c" : "NA";
        } else {
            obj.orgPrice = "NA";
        }     // Check for specific terms in `obj.title`
        if (obj.title.includes('plate')) {
            obj.ssp = "proof plate";
        } else if (obj.title.includes('single')) {
            obj.ssp = 1;
        } else if (obj.title.includes('sheet') || obj.title.includes('block') || obj.title.includes('strip')) {
            const match = obj.title.match(/\d+/);
            if (match) {
                const number = parseInt(match[0]);
                if (obj.title.includes('strip of')) {
                    obj.ssp = number;
                } else if (obj.title.includes('block of')) {
                    obj.ssp = number;
                } else if (obj.title.includes('sheet of')) {
                    obj.ssp = number;
                } else {
                    obj.ssp = "NA";
                }
            } else
             {
                obj.ssp = "NA";
            }
        }
        else
             {
                obj.ssp = "NA";
            }


        // Add the processed object to the cleanedData array
        cleanedData.push(obj);
    });

    return cleanedData;
}


// Load the data
async function runCode() {
    await loadData();
    for (i = 0; i < cleanedData.length; i++) {
        indexedData[i] = createStampIndex(cleanedData[i]);
        bucketedData[i] = classifyStampByBucket(indexedData[i]);
        
    }

    createRadarChart(bucketedData[2].allIndices)
    createBucketChart(bucketedData);
    createParallelChart(bucketedData);

    // if(bucketedData.allIndices)
    //     {
    //         bucketedData.filter(data => data.allIndices.perforation > 0).forEach(data => console.log(data));
    
    //     }
}

runCode();



function createStampIndex(stamp) {
    let index = 0;

    // Condition of the Stamp (Unused, Mint, etc.)(max 15)
    let conditionIndex = 0;
    if (stamp.description && stamp.description.includes("unused")) {
        conditionIndex = 25;
    } else if (stamp.description && stamp.description.includes("mint")) {
        conditionIndex = 50;
    } else if (stamp.description && (stamp.description.includes("lightly used") || stamp.description.includes("slightly worn"))) {
        conditionIndex = 5;
    }
    index += conditionIndex;

    // Perforation Types (e.g., perf 12, Grill)
    let perforationIndex = 0;
    if (stamp.description && (stamp.description.includes("perf 12") || stamp.description.includes("grill"))) {
        perforationIndex = 12;
        
    }
    index += perforationIndex;

   // rarity of the Stamp (max 25)
    let rarityIndex = 0;
    if (stamp.ssp === "proof plate" || stamp.title.includes("error") || stamp.title.includes("rare") || stamp.description.includes("plate proof")) {
        rarityIndex = 35;
    }
    index += rarityIndex;

    // rarity of the Stamp (max 10)
    let printingTechniquesIndex = 0;
    if (stamp.medium && (stamp.medium.includes("engraving") || stamp.medium.includes("plate printing"))) {
        printingTechniquesIndex = 20;
    }
    index += printingTechniquesIndex;

   // rarity of the Stamp (max 15)
    let editionIndex = 0;
    if (stamp.title && (stamp.title.includes("first issue") || stamp.title.includes("limited edition") || stamp.description.includes("reprint"))) {
        editionIndex = 10;
    }
    index += editionIndex;

    // Historical Significance (e.g., Civil War, World War) max: 5
    let historicalSignificanceIndex = 0;
    if (stamp.topics) {
        for (let topic of stamp.topics) {
            if (topic.match(/(Civil War|World War|Expedition|Revolution|Historic Event|Colonial|Empire|Independence|Liberation|Rebellion|Suffrage|Equality|Socialism|Communism|Uprising|Holocaust|Genocide|Economic Crisis|Depression|Renaissance|Enlightenment|Art Movement|Labor Movement|Globalization|Exploration)/i)) {
                historicalSignificanceIndex = 30;
                break;
            }
        }
    }
    index += historicalSignificanceIndex;
    

    let famousFiguresIndex = 0;
    if (stamp.title || stamp.depicts) {
          // Expanded list of famous figures across various domains
          const famousFigures = [
                "Washington", "Franklin", "Lincoln", "Roosevelt", "Byrd", "Jefferson", "Adams", "Hamilton", 
                "Jackson", "Kennedy", "Eisenhower", "Truman", "Carver", "Douglas", "King", "Obama", "Teddy Roosevelt", 
                "Ford", "Madison", "Grant", "Patton", "Montgomery", "Churchill", "Stalin", "Lenin", "Einstein", 
                "Newton", "Darwin", "Curie", "Galileo", "Tesla", "Pasteur", "Fermi", "Hemingway", "Twain", "Dickens", 
                "Shakespeare", "Mozart", "Beethoven", "Van Gogh", "Picasso", "Michelangelo", "Socrates", "Aristotle", 
                "Plato", "Confucius", "Gandhi", "Mandela", "Boudicca", "Catherine the Great", "Cleopatra", "Marie Curie",
                "Harriet Tubman", "Rosa Parks", "Malcolm X", "Frederick Douglass", "Susan B. Anthony", "Wright Brothers", 
                "Amelia Earhart", "Neil Armstrong", "Buzz Aldrin", "Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Oprah"
          ];
     
          // Check if the title or depicts includes any of the famous figures
          if (famousFigures.some(figure => stamp.title?.includes(figure) || stamp.depicts?.includes(figure))) {
                famousFiguresIndex = 10;
          }
     }
     index += famousFiguresIndex;
    

    // Denomination and Scarcity
    let denominationIndex = 0;
    const denomination = parseFloat(stamp.orgPrice.replace(/[^\d.-]/g, ''));
    if (denomination >= 50 || (denomination >= 1 && stamp.orgPrice.includes('$'))) {
        denominationIndex = 20;
    } else if (denomination >= 10) {
        denominationIndex = 10;
    } else {
        denominationIndex = Math.round((denomination / 10) * 2);
    }
    index += denominationIndex;



    // Date and Period of Issue
    let dateIndex = 0;
    const year = parseInt(stamp.date[0].substring(0, 4));
    if (year <= 1800) {
        dateIndex = 30;
    } else if (year < 1900) {
        dateIndex = 20;
    } else if (year < 1950) {
        dateIndex = 10;
    }
    index += dateIndex;

 

    // Collection and Catalog Info (e.g., Scott Catalogue, Imperforate, Error, etc.)
    let collectionIndex = 0;
   
    
    // Ensure we're checking if the collection is present
    if (stamp.collection) {
        // Check if it's part of the Scott Catalogue collection
        if (stamp.collection.includes("Scott Catalogue")) {
            collectionIndex += 0.5; // Base value for Scott Catalogue stamps
    
            // Regular issues and commemorative stamps
            if (stamp.collection.match(/USA \d+/)) { // USA Scott numbers
                collectionIndex += 3;  // Regular USA stamps 
            }
            if (stamp.collection.includes("USA PR")) { collectionIndex += 3.5; } // Plate proofs
            if (stamp.collection.includes("USA O")) { collectionIndex += 4; } // Official stamps
            if (stamp.collection.includes("USA J")) { collectionIndex += 3.5; } // Postage Due
            if (stamp.collection.match(/Scott Catalogue USA (\d{1,3}[A-Z0-9]*)/)) { collectionIndex += 3; } // Commemoratives
            
            // Famous series and errors
            if (stamp.collection.includes("Inverted Jenny")) { collectionIndex += 5; }
            if (stamp.collection.includes("imperforate")) { collectionIndex += 4; } // Imperforate
            if (stamp.collection.includes("error")) { collectionIndex += 5; } // Printing errors
            if (stamp.collection.includes("Airmail")) { collectionIndex += 4.5; }
            if (stamp.collection.includes("classic")) { collectionIndex += 3; }
            
            // Specific famous stamps and errors
            if (stamp.collection.includes("Scott Catalogue USA 11")) { collectionIndex += 5; }
            if (stamp.collection.includes("Scott Catalogue USA 143L3")) { collectionIndex += 4; }
            if (stamp.collection.includes("Scott Catalogue USA 44TC")) { collectionIndex += 4; }
            if (stamp.collection.includes("Scott Catalogue CSA 6")) { collectionIndex += 6; }
            if (stamp.collection.includes("Scott Catalogue CSA 7")) { collectionIndex += 6.5; }
            if (stamp.collection.includes("Scott Catalogue USA 246")) { collectionIndex += 4.5; }
            
            // Back-of-Book stamps
            if (stamp.collection.includes("Back-of-Book")) { collectionIndex += 3.5; }
            if (stamp.collection.includes("Revenue")) { collectionIndex += 4.5; }
            
            // Additional specialized categories
            if (stamp.collection.includes("Postal Tax")) { collectionIndex += 4; } // Tax stamps
            if (stamp.collection.includes("Postage Due")) { collectionIndex += 3.5; }
            if (stamp.collection.includes("Special Printing")) { collectionIndex += 4; }
            if (stamp.collection.includes("Reprint")) { collectionIndex += 3; }
        }
    }
    
    index += collectionIndex;
    

 
     
// Define sets for printers to simplify checks
const engravingPrinters = new Set([
    "National Bank Note Company",
    "American Bank Note Company",
    "Bureau of Engraving and Printing",
    "Wells Fargo & Co.",
    "Post Office Department",
    "Security Engraving and Printing",
    "Postal Press of New York",
    "U.S. Treasury"
]);

// Initialize printerIndex
let printerIndex = 0;

if (stamp.printer !== "NA") {
    // Match printers and adjust the index
    if (engravingPrinters.has(stamp.printer)) {
        switch (stamp.printer) {
            case "National Bank Note Company":
            case "American Bank Note Company":
                printerIndex += 1; // Increment for these printers
                break;
            case "Bureau of Engraving and Printing":
            case "Wells Fargo & Co.":
                printerIndex += 2; // Increment for these printers
                break;
            case "Security Engraving and Printing":
                printerIndex += 2.5; // Slightly higher for Security Engraving and Printing
                break;
            case "Postal Press of New York":
                printerIndex += 2; // Postal Press of New York
                break;
            case "U.S. Treasury":
                printerIndex += 3; // U.S. Treasury gets the highest index boost
                break;
            case "Post Office Department":
                printerIndex += 0.5; // Post Office Department gets a small boost
                break;
        
            case "National Bank Note Company":
                printerIndex += 2;
                break;
            case "American Bank Note Company":
                printerIndex += 1.5;
                break;
            case "Bureau of Engraving and Printing":
                printerIndex += 1.2;
                break;
            case "Wells Fargo & Co.":
                printerIndex += 1;
                break;
            case "Post Office Department":
                printerIndex += 0.8;
                break;
            case "Security Engraving and Printing":
                printerIndex += 0.6;
                break;
            case "Postal Press of New York":
                printerIndex += 0.4;
                break;
            case "U.S. Treasury":
                printerIndex += 0.2;
                break;
            default:
                break;
        }
    }

    // Additional checks for engraving medium or proof plates
    if (stamp.medium && stamp.medium.includes("engraving")) {
        printerIndex += 1; // Engraving medium boosts the index
    }
    
    if (stamp.ssp && stamp.ssp === "proof plate") {
        printerIndex += 1.5; // Proof plate adds a larger boost
    }

    // Description check for plate mark or watermark
    if (stamp.description && (stamp.description.includes("plate mark") || stamp.description.includes("watermark"))) {
        printerIndex += 1.2; // Add value for plate marks or watermarks
    }
}

// Add printerIndex to the overall index
index += printerIndex;


    // Add the calculated index to the stamp object
    stamp.index = index;
  
     maxIndex = maxcondition + maxrarity + maxprintingtechniques + maxedition + maxhistoricalsignificance + maxfamousfigures + maxdenomination + maxperforation + maxdate + maxcollection + maxprinter;
    // console.log("maxIndex:", maxIndex);
    // // Log the factors and their maximum indices
    // console.log("Condition:", conditionIndex + " / " + maxConditionIndex);
    // console.log("Rarity:", rarityIndex + " / " + maxRarityIndex);
    // console.log("Printing Techniques:", printingTechniquesIndex + " / " + maxPrintingTechniquesIndex);
    // console.log("Edition:", editionIndex + " / " + maxEditionIndex);
    // console.log("Historical Significance:", historicalSignificanceIndex + " / " + maxHistoricalSignificanceIndex);
    // console.log("Famous Figures:", famousFiguresIndex + " / " + maxFamousFiguresIndex);
    // console.log("Denomination:", denominationIndex + " / " + maxDenominationIndex);
    // console.log("Perforation:", perforationIndex + " / " + maxPerforationIndex);
    // console.log("Date:", dateIndex + " / " + maxDateIndex);
    // console.log("Collection:", collectionIndex + " / " + maxCollectionIndex);
    // console.log("Printer:", printerIndex + " / " + maxPrinterIndex);

    // Create an object with all the current values
    const allIndices = {
        'condition': conditionIndex,
        'rarity': rarityIndex,
        'printingtechniques': printingTechniquesIndex,
        'edition': editionIndex,
        'historicalsignificance': historicalSignificanceIndex,
        'famousfigures': famousFiguresIndex,
        'denomination': denominationIndex,
        'perforation': perforationIndex,
        'date': dateIndex,
        'collection': collectionIndex,
        'printer': printerIndex
    };

    // Add the current values object to the stamp
    stamp.allIndices = allIndices;

    // Return the updated stamp object with the index and current values
    return stamp;
}

function classifyStampByBucket(data) {
    
    if (data.index >= 190) {
        data.bucket = "Extraordinarily High Value";
        } else if (data.index >= 160) {
        data.bucket = "Extremely Rare";
        } else if (data.index >= 100) {
        data.bucket = "Very High Value";
        } else if (data.index >= 70) {
        data.bucket = "High Value";
        } else if (data.index >= 50) {
        data.bucket = "Moderate Value";
        } else {
        data.bucket = "Low Value";
        }
    return(data)
}


function createRadarChart(data) {
    var margin = {top: 100, right: 100, bottom: 100, left: 100},
    width = 300;
    height = 300;

    const svg = d3.select("#radarChart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    
    // Create the radar chart
    const radarData = Object.entries(data).map(([key, value]) => {
        const maxKey = `max${key}`;
        const max = eval(maxKey);
        return { axis: key, value: value / max , maxValue: max };
    });

    // Sort the radar data in descending order of max
    radarData.sort((c) => c.value);


    // Create the radar chart
    const radius = Math.min(width, height) / 2;
    const angleSlice = Math.PI * 2 / radarData.length;

    // Create the scales
    const rScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, radius]);

    // Create the radial line generator
    const line = d3.lineRadial()
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice);

    // Create the radar chart container
    const radarChart = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create the radar chart polygons
    radarChart.selectAll(".radarPolygon")
        .data([radarData])
        .enter()
        .append("path")
        .attr("class", "radarPolygon")
        .attr("d", d => line(d))
        .style("fill", primaryColour)
        .style("stroke", secondaryColour)
        .style("stroke-width", "2px");

    // Create the radar chart axes
    const axis = radarChart.selectAll(".radarAxis")
        .data(radarData)
        .enter()
        .append("g")
        .attr("class", "radarAxis");

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(1) * Math.cos(i * angleSlice - Math.PI / 2))
        .attr("y2", (d, i) => rScale(1) * Math.sin(i * angleSlice - Math.PI / 2))
        .attr("class", "radarLine")
        .style("stroke", "rgba(0, 0, 0, 0.5)")
        .style("stroke-width", "1px");

    axis.append("circle") // Add circle to mark the data point on the axis
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(i * angleSlice - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(i * angleSlice - Math.PI / 2))
        .attr("r", 4)
        .style("fill", primaryColour)
        .style("stroke", secondaryColour)


    axis.append("text")
        .attr("class", "radarLabel")
        .attr("x", (d, i) => rScale(1.15) * Math.cos(i * angleSlice - Math.PI / 2))
        .attr("y", (d, i) => rScale(1.15) * Math.sin(i * angleSlice - Math.PI / 2))
        .text(d => d.axis)
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style("fill", secondaryColour)

}


function createBucketChart(data) {
    
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
    

    const svg=d3.select("#barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleBand()
        .domain(["Low Value", "Moderate Value", "High Value", "Very High Value", "Extremely Rare", "Extraordinarily High Value"])
        .range([0, width])
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 250])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add lines
    svg.selectAll("line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function (d) { return x(d.bucket); })
        .attr("y1", function (d) { return y(d.orgPrice); })
        .attr("x2", function (d, i) { return x(d.bucket) + x.bandwidth(); })
        .attr("y2", function (d) { return y(d.orgPrice); })
        .on("click", function(d) {
            handleLineClick(d);
        })
        .style("stroke", secondaryColour)
        .attr("stroke-width", 2)
        .attr("opacity", 0.2);     

}



function createParallelChart(data) {
   

    var margin = { top: 50, right: 50, bottom: 30, left: 50 };
    var width = 1000 - margin.left - margin.right;
    var height = 3000 - margin.top - margin.bottom;

    const svg = d3.select("#ParallelChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const dimensions = Object.keys(data[0].allIndices);

    // Create scales for each dimension
    const xScales = {};
    dimensions.forEach(dim => {
        xScales[dim] = d3.scaleLinear()
            .domain(d3.extent(data, d => d.allIndices[dim] || 0)) // Ensure valid domains
            .range([0, width]);
    });

    const yScale = d3.scalePoint()
        .domain(dimensions)
        .range([0, height])
        .padding(1);

    // Global state to track selected ranges
    const selectedRanges = {};

    // Function to filter and update lines based on brushes
    function updateLines() {
        const filteredData = data.filter(d => {
            return dimensions.every(dim => {
                const range = selectedRanges[dim];
                const value = d.allIndices[dim];
                return !range || (value >= range[0] && value <= range[1]);
            });
        });

        svg.selectAll(".line")
            .data(filteredData, d => d.id) // Use a unique identifier if available
            .join(
                enter => enter.append("path")
                    .attr("class", "line")
                    .attr("d", d => {
                        const path = dimensions.map(dim => {
                            const value = d.allIndices[dim];
                            return value !== undefined && !isNaN(value)
                                ? [xScales[dim](value), yScale(dim)]
                                : null;
                        }).filter(p => p !== null); // Remove null points
                        return d3.line()(path);
                    })
                    .style("fill", "none")
                    .style("stroke", secondaryColour)
                    .style("opacity", 0.1)
                    .style("stroke-width", 1.5),
                update => update, // Update unchanged
                exit => exit.remove() // Remove lines no longer matching filter
            );
    }

    // Add axes with brushes for each dimension
    dimensions.forEach(dim => {
        const axisGroup = svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${yScale(dim)})`);

        axisGroup.call(d3.axisBottom(xScales[dim]));

        // Add axis label
        axisGroup.append("text")
            .attr("class", "axis-label")
            .attr("x", width - 30)
            .attr("y", -30)
            .style("text-anchor", "center")  
            .style("fill", secondaryColour)
            .style("font-size", "16px")
            .text(dim); // Set the text for the inner div          // Add brush
        selectedRanges[dim] = [xScales[dim].domain()[0], xScales[dim].domain()[1]];
        var nonfilterColour = "gray";
        axisGroup.append("g")
            .attr("class", "brush")
            .call(d3.brushX()
                .extent([[0, -10], [width, 30]]) // Brush area
                .on("start brush end", function (event) {
                    const selection = event.selection;
                    if (selection) {
                        const [min, max] = selection.map(xScales[dim].invert); // Get range
                        selectedRanges[dim] = [min, max];
                        d3.select(this).select(".selection")
                            .style("fill", secondaryColour)
                        
                        nonfilterColour = "gray";

                    } else {
                        delete selectedRanges[dim]; // Clear filter
                    }
                    updateLines();
                })
            )
            // .selectAll(".overlay") // Select the brush overlay
            
            .attr("class", "selection")
            .attr("cursor", "move")
            .attr("fill-opacity", "1")
            .style("stroke", secondaryColour)
            .attr("shape-rendering", "crispEdges")
            .attr("x", 0)
            .attr("y", -10)
            .attr("width", width)
            .attr("height", 30)
            .style("fill", primaryColour)

    });

    // Initial draw of all lines
    updateLines();
}



const state = {
    currentState: "initial",
    isModalOpen: false,
    // Add more state properties here if needed
};

// Function to handle line click event
function handleLineClick(data) {
    console.log("Line clicked:", data);
    state.isModalOpen = true;
    // Clear previous modal content
    d3.select("#modal").style("display", "flex");

    // Create a clickable image link
    const modalImageContainer = d3.select("#modal-image-container");

    // Remove existing content to avoid duplication
    modalImageContainer.selectAll("*").remove();

    // Append a link around the image
    modalImageContainer.append("a")
        .attr("href", data.link) // Set the link to the person's link
        .attr("target", "_blank") // Open link in a new tab
        .append("img")
        .attr("src", data.thumbnail)
        .attr("alt", data.title)
        .style("max-width", "100%") // Ensure the image fits the modal
        .style("height", "auto");

    // Update text information
    d3.select("#modal-radar").attr("src", createRadarChart(data.allIndices));
    d3.select("#modal-image").attr("src", data.thumbnail);
    d3.select("#modal-name").text(data.title);
    d3.select("#modal-desc").text(data.description);

    // Create the radar chart
    const radarChartContainer = d3.select("#modal-radar-chart");

    // Remove existing content to avoid duplication
    radarChartContainer.selectAll("*").remove();

    // Create the radar chart SVG
    const radarChartSvg = radarChartContainer.append("svg")
        .attr("width", 300)
        .attr("height", 300);

    // Call the createRadarChart function to generate the chart
    createRadarChart(data.allIndices, radarChartSvg);

    // Create the bucket chart
    const bucketChartContainer = d3.select("#modal-bucket-chart");

    // Remove existing content to avoid duplication
    bucketChartContainer.selectAll("*").remove();

    // Create the bucket chart SVG
    const bucketChartSvg = bucketChartContainer.append("svg")
        .attr("width", 500)
        .attr("height", 400);

    // Call the createBucketChart function to generate the chart
    createBucketChart([data], bucketChartSvg);

    d3.select("#modal-link")
        .html(`<a href="${data.link}" target="_blank">☞ More Info</a>`);
}

d3.select("#close-modal").on("click", function() {
    d3.select("#modal").style("display", "none");
});

d3.select("#modal").on("click", function(event) {
    if (event.target === this) {
        d3.select("#modal").style("display", "none");
    }
});




