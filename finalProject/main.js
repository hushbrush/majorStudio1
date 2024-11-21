




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
  const maxscarcity = 40;
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
            obj.orgPrice = obj.title.match(regex)[0];
        } else if (obj.title.includes('cent')) {
            const match = obj.title.match(/\d+/);
            obj.orgPrice = match ? match[0] + "c" : "NA";
        } else {
            obj.orgPrice = "NA";
        }

        // Check for specific terms in `obj.title`
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
   
    createRadarChart(bucketedData[0].allIndices)
    createBucketChart(bucketedData);
    bucketedData.filter(data => data.index > 160).forEach(data => console.log(data));
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
            if (topic.includes("Civil War") || topic.includes("World War") || topic.includes("Expedition") || topic.includes("Revolution") || topic.includes("Historic Event")) {
                historicalSignificanceIndex = 30;
                break; 
            }
        }
    }
    index += historicalSignificanceIndex;

    // Famous Individuals (Washington, Franklin, etc.) max: 5
    let famousFiguresIndex = 0;
    if (stamp.title && (stamp.title.includes("Washington") || stamp.title.includes("Franklin") || stamp.title.includes("Lincoln") || stamp.title.includes("Roosevelt") || stamp.title.includes("Byrd"))) {
        famousFiguresIndex = 10;
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

    // Perforation Types (e.g., perf 12, Grill)
    let perforationIndex = 0;
    if (stamp.description && (stamp.description.includes("perf 12") || stamp.description.includes("grill"))) {
        perforationIndex = 12;
    }
    index += perforationIndex;

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

    // Scarcity and Demand (e.g., Unique, Extremely Rare)
    let scarcityIndex = 0;
    if ( stamp.title.includes("unique") || stamp.title.includes("one-of-a-kind")) {
        scarcityIndex = 20;
    } else if (stamp.title && (stamp.title.includes("extremely rare") || stamp.description.includes("few known"))) {
        scarcityIndex = 40;
    }
    index += scarcityIndex;

    // Collection and Catalog Info (e.g., Scott Catalogue, Imperforate, Error, etc.)
    let collectionIndex = 0;
    if (stamp.collection && stamp.collection.includes("Scott Catalogue")) {
        collectionIndex += 0.5;
        if (stamp.collection.includes("P")) {
            collectionIndex += 2;
        }
        if (stamp.collection.includes("X")) {
            collectionIndex += 1.5;
        }
        if (stamp.collection.includes("A")) {
            collectionIndex += 1.5;
        }
        if (stamp.collection.includes("imperforate")) {
            collectionIndex += 2.5;
        }
        if (stamp.collection.includes("error")) {
            collectionIndex += 3;
        }
        if (stamp.collection.includes("Back-of-Book")) {
            collectionIndex += 1.5;
        }
        if (stamp.collection.includes("Commemorative")) {
            collectionIndex += 1;
        }
        if (stamp.collection.includes("classic")) {
            collectionIndex += 2;
        }
        if (stamp.collection.includes("Inverted Jenny")) {
            collectionIndex += 5;
        }
        }
    index += collectionIndex;

    // Printer Information (e.g., National Bank Note Company, Bureau of Engraving and Printing)
    let printerIndex = 0;
    if (stamp.printer) {
        if (stamp.printer.includes("National Bank Note Company")) {
            printerIndex += 1;
        } else if (stamp.printer.includes("American Bank Note Company")) {
            printerIndex += 1;
        } else if (stamp.printer.includes("Bureau of Engraving and Printing") || stamp.printer.includes("BEP")) {
            printerIndex += 2;
        } else if (stamp.printer.includes("Wells Fargo & Co.")) {
            printerIndex += 2;
        } else if (stamp.printer.includes("Post Office Department")) {
            printerIndex += 0.5;
        }
        if (stamp.medium && stamp.medium.includes("engraving")) {
            printerIndex += 1;
        }
        if (stamp.ssp && stamp.ssp === "proof plate") {
            printerIndex += 1.5;
        }
        if (stamp.description && (stamp.description.includes("plate mark") || stamp.description.includes("watermark"))) {
            printerIndex += 1.2;
        }
        if (stamp.printer.includes("Security Engraving and Printing")) {
            printerIndex += 2.5;
        }
        if (stamp.printer.includes("Postal Press of New York")) {
            printerIndex += 2;
        }
        if (stamp.printer.includes("U.S. Treasury")) {
            printerIndex += 3;
        }
    }
    index += printerIndex;

    // Add the calculated index to the stamp object
    stamp.index = index;
  
     maxIndex = maxcondition + maxrarity + maxprintingtechniques + maxedition + maxhistoricalsignificance + maxfamousfigures + maxdenomination + maxperforation + maxdate + maxscarcity + maxcollection + maxprinter;
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
    // console.log("Scarcity:", scarcityIndex + " / " + maxScarcityIndex);
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
        'scarcity': scarcityIndex,
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
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    const svg = d3.select("#radarChart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

    
    // Create the radar chart
    const radarData = Object.entries(data).map(([key, value]) => {
        const maxKey = `max${key.charAt(0).toUpperCase() + key.slice(1)}Index`;
        const max = eval(maxKey);
        return { axis: key, value: value / max };
    });

    const radarChart = new Chart(svg, {
        w: width,
        h: height,
        maxValue: 1,
        levels: 5,
        roundStrokes: true,
        color: d3.scaleOrdinal().range(["#EDC951", "#CC333F", "#00A0B0"]),
    });

    radarChart.draw(radarData);
    

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
        .attr("stroke", "black")
        .attr("opacity", 0.2);

}


