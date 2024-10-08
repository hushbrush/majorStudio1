let text = "	This is a proof of the 1 barrel, $1 Beer Stamp of the 1867 issue. The Scott number, if listed, would be REA12P3. The Note Printing Division of the Treasury Department, precursor of the Bureau of Engraving and Printing, printed the 1867 issue using dies modified from those used for the 1866 issue. The changes involved leaving an open space for cancellation at the top. It printed the stamps on white wove unwatermarked paper from plates of twenty subjects, five rows of four stamps each. A small plate number, 1.5 mm high, appeared in the center of the lower middle block of 4. The plate number used for REA12 is not known. The Treasury Department issued the stamps to brewers without gum or perforations. The brewers cut the stamps apart, cancelled them, and pasted them over the bung of the beer barrel so that tapping the barrel destroyed the stamp. The stamps included some circular shapes and some square. The stamps had a pattern of thirty-one small holes punched in them before issue. When tapping the barrel, the holes helped destroy the stamp. 	Revenue Stamps";
let text2= "This is a 2-cent bright green Andrew Jackson; issued imperforate; lithographed by Hoyer & Ludwig of Richmond, Virginia; only one transfer stone used; earliest use March 21, 1862. A full printed sheet consisted of two panes of 100 stamps each arranged in two blocks of fifty (10X5) taken from the 50-subject transfer stone with a wide vertical gutter between panes."
    //okokokokokook we're fine we're gonna try to find out what this stamp is about.
    //so, let's display all the nouns in this?
  

    let rs = new RiString(text2);
    let words = rs.words();
    let pos = rs.pos();

    let nouns = [];
    let adjectives = [];
    
    for (let i = 0; i < pos.length; i++) {
        if (pos[i]=="nnp"|| pos[i]=="nnps")  { 
            nouns.push(words[i]);
              }
    }
    console.log(nouns);

    let nounCounts = {};
    nouns.forEach(noun => {
        nounCounts[noun] = (nounCounts[noun] || 0) + 1;
    });

    let mostFrequentNouns = Object.entries(nounCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    console.log(mostFrequentNouns);
   // console.log(rs.getFeature("phonemes"));  

  