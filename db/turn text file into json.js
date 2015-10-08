fs = require('fs');
var textFile = fs.readFile('textfile', {encoding: 'utf8'}, function(err, data) {
  if(err) throw err;
  var splitArray = data.split('}}{{');

  var Id = 0;
  var allTitles = [];

  var results = [];

  for(var i = 0; i < splitArray.length; i++) {
    
    var tempArray = splitArray[i].split(',');
    
    if(allTitles.indexOf(tempArray[1]) === -1) {
      allTitles.push(tempArray[1]);
    }

    var thisReview = tempArray[5];
    for(var j = 6; j < tempArray.length; j++) {
      thisReview += "," + tempArray[j];
    }

    results.push({
      id: Id,
      review: thisReview,
      reviewer: tempArray[4],
      correctTitle: tempArray[1],
      titles: []
    });

    Id++;
  }

  for(var i = 0; i < results.length; i++) {
    results[i].titles[0] = allTitles[Math.floor(allTitles.length*Math.random())];
    results[i].titles[1] = allTitles[Math.floor(allTitles.length*Math.random())];
    results[i].titles[2] = allTitles[Math.floor(allTitles.length*Math.random())];
    results[i].titles[3] = allTitles[Math.floor(allTitles.length*Math.random())];
    results[i].titles[Math.floor(4*Math.random())] = results[i].correctTitle;
  }

  console.log(results[9]);
  // console.log(results[8]);
  // console.log(results[7]);
  // console.log(results[6]);
  fs.writeFile('asdf', JSON.stringify(results), function(err, data) {
    if(err) console.log(err);
    console.log('data!');
    console.log(data);
  })
});

