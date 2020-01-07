
// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}
// Called automatically when YouTube API interface is loaded 
function onYouTubeApiLoad() {
  gapi.client.setApiKey('AIzaSyAGPp2kfCY5I8cc7RaK0wyhr1d3sLkDsSI');
}

// Called when the search button is clicked in the html code
function search() {
  var query = document.getElementById('autocomplete-default').value;
  // Use the JavaScript client library to create a search.list() API call.
  var request = gapi.client.youtube.videos.list({
    part: 'snippet, statistics', chart: "mostPopular", maxResults: 50,
    regionCode: query
  });
  // Send the request to the API server, call the onSearchResponse function when the data is returned
  request.execute(onSearchResponse);
}

function search_most_view() {
  var query = document.getElementById('autocomplete-default').value;
  // Use the JavaScript client library to create a search.list() API call.
  var request = gapi.client.youtube.search.list({
    part: 'snippet',
    order: 'viewCount',
    maxResults: 50,
    q: query
  });
  // Send the request to the API server, call the onSearchResponse function when the data is returned
 
}

// Triggered by this line: request.execute(onSearchResponse);
function onSearchResponse(response) {
  // var responseString = JSON.stringify(response, '', 2);
  // document.getElementById('response').innerHTML = responseString;

  video_id_list = [];
  tags = [];
  titles=[];
  views_count=[];
  like_count=[];
  for (var i = 0; i < response.items.length; i++) {

    var views = response.items[i].statistics.viewCount;
    views_count.push(views);
    var comments = response.items[i].statistics.commentCount;
    var likes = response.items[i].statistics.likeCount;
    like_count.push(likes);
    var dislikes = response.items[i].statistics.dislikeCount;
    var publishedAt = response.items[i].snippet.publishedAt;
    var channelId = response.items[i].snippet.channelId;
    var title = response.items[i].snippet.title;
    titles.push(title);
    var description = response.items[i].snippet.description;
    var channelTitle = response.items[i].snippet.channelTitle;
    var tag = response.items[i].snippet.tags;
    tags.push(tag);
    var videoID = response.items[i].id;
    var video = "<iframe width='420' height='315' src='https://www.youtube.com/embed/" + videoID + "'></iframe>";
    video_id_list.push(videoID);

    buildTable(views, comments, likes, dislikes, publishedAt, title, description, channelTitle, channelId, videoID, video);
    // buildTable_tag(tag);
  }

  var obj1 = tags.toString();

  var obj_circular = {};
  titles.forEach((key, i) => obj_circular[key] = views_count[i]);
  // console.log(obj_circular);
  var data = Object.entries(obj_circular).map((k, v) => { return { "title_name": (k.slice(0, 1)).toString(), "view_name":(k.slice(1, 2)).toString() } });
  // var data=[data_1];
  console.log(data);
  // console.log(JSON.stringify(data));
  // console.log(Object.keys(data)[0]);

  var margin = {top: 100, right: 0, bottom: 120, left: 150},
  width = 760 - margin.left - margin.right,
  height = 780 - margin.top - margin.bottom,
  innerRadius = 90,
  outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svg = d3.select("#my_dataviz_circular")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv", function(data) {

// Scales
// var data=my_circular;
var x = d3.scaleBand()
    .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
    .align(0)                  // This does nothing
    .domain(data.map(function(d) { return d.title_name; })); // The domain of the X axis is the list of states.
var y = d3.scaleRadial()
    .range([innerRadius, outerRadius])   // Domain will be define later.
    .domain([0, 25000000]); // Domain of Y is from 0 to the max seen in the data


    // create a tooltip
  var tooltip = d3.select("#my_dataviz_circular")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "2px")
  // .style("padding", "1px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  tooltip
    .style("opacity", 1)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
}
var mousemove = function(d) {
  tooltip
    .html("Title: " + d.title_name)
    .style("left", (d3.mouse(this)[0]-2) + "px")
    .style("top", (d3.mouse(this)[1]+400) + "px")
}
var mouseleave = function(d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.8)
}

// Add the bars
svg.append("g")
  .selectAll("path")
  .data(data)
  .enter()
  .append("path")
    // .attr("fill", "#69b3a2")
    .attr("fill", function(d) {
      if (d.view_name > 20000000) {
        return "#004d57";
      } else if (d.view_name > 10000000) {
        return "#2c6a75";
      }
     else if (d.view_name > 5000000) {
      return "#6ea9b4";
    }
      return "#8ecad6";
    })
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return y(d.view_name); })
        .startAngle(function(d) { return x(d.title_name); })
        .endAngle(function(d) { return x(d.title_name) + x.bandwidth(); })
        .padAngle(0.01)
        .padRadius(innerRadius))
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)
// console.log(data.title_name);

// Add the labels
svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
      .attr("text-anchor", function(d) { return (x(d.view_name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function(d) { return "rotate(" + ((x(d.title_name) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.view_name)+10) + ",0)"; })
    .append("text")
      .text(function(d){return(d.view_name)})
      .attr("transform", function(d) { return (x(d.title_name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "11px")
      .attr("alignment-baseline", "middle");

// });

  function wordCount(myString) {
    var stringArray = myString.split(",");
    var wordFrequency = {};

    // Iterate through the array
    for (var i = 0; i < stringArray.length; i++) {
      var currentWord = stringArray[i];
      // If the word has been seen before...
      if (currentWord in wordFrequency) {
        // Add one to the counter
        wordFrequency[currentWord] += 1;
      }
      else {
        wordFrequency[currentWord] = 1;
      }
    }
    return wordFrequency;
  }
  var obj = wordCount(obj1);
  // console.log(wordCount(obj));
  var myWords = Object.entries(obj).map((k, v) => { return { "word": (k.slice(0, 1)).toString(), "size": (k.slice(1, 2)).toString() } });
  console.log(myWords);
  var myWords_top = myWords.sort(function (a, b) {
    return parseFloat(b.size) - parseFloat(a.size);
  });

  // Slice the first 10 objects for plotting
  myWords_top1 = myWords_top.slice(0, 10);

  // Reverse the array due to Plotly's defaults
  myWords_top10 = myWords_top1.reverse();
  myWords_top11 = myWords_top10.reverse();


  // set the dimensions and margins of the graph
  var margin = { top: 50, right: 10, bottom: 100, left: 10 },
    width = 790 - margin.left - margin.right,
    height = 740 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here

  var fill = d3.scaleOrdinal(d3.schemeCategory20);

  var layout = d3.layout.cloud()
    .size([width, height])
    .words(myWords.map(function (d) { return { text: d.word, size: d.size }; }))
    .padding(5)        //space between words
    .rotate(function () { return ~~(Math.random() * 2) * 90; })
    .fontSize(function (d) { return d.size * 10; })      // font size of words
    .on("end", draw);
  layout.start();

  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    svg
      .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function (d) { return d.size; })
      .style("fill", (d, i) => fill(i))
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) { return d.text; });
  }

  // set the dimensions and margins of the graph
  var margin = { top: 100, right: 30, bottom: 130, left: 180 },
    width = 560 - margin.left - margin.right,
    height = 580 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz_bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 12])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("font-size", "16px")
    .style("text-anchor", "end");

  svg.append("text")
    .style("font-size", "16px")
    .style("color", "#1a697b")
    .text("Word Frequency")
    .style("font-family", "Arial");

  // Y axis
  var y = d3.scaleBand()
    .range([0, height])
    .domain(myWords_top10.map(function (d) { return d.word; }))
    .padding(.3);
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "16px")
    .style("color", "#519459")

  //Bars
  svg.selectAll("myRect")
    .data(myWords_top10)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function (d) { return y(d.word); })
    .attr("width", function (d) { return x(d.size); })
    .attr("height", y.bandwidth())
    .attr("fill", "#6c9a5a")

  for (var i = 0; i < video_id_list.length; i++) {
    var request = gapi.client.youtube.commentThreads.list({
      part: 'snippet',
      textFormat: "plainText",
      videoId: video_id_list[i],
      maxResults: 1,
      order: "relevance"
    });
    request.execute(onSearchResponse_comment);

  }
  comments_list = [];
  function onSearchResponse_comment(responsee) {
    // var responseString = JSON.stringify(response, '', 2);
    // document.getElementById('response').innerHTML = responseString;

    for (var i = 0; i < responsee.items.length; i++) {
      var comment_detail = responsee.items[i].snippet.topLevelComment.snippet.textDisplay;
      comments_list.push(comment_detail);
      var videoID = responsee.items[i].snippet.videoId;
      // console.log(comment_detail);
    }
    buildTable_comment(videoID, comment_detail);
  }
  // function buildTable_tag(tag){
  //     var table_tag = d3.select("#slide1");
  //     var tbody_tag = table_tag.select("tbody");
  //     var trow;
  //     trow = tbody_tag.append("tr");
  //     trow.append("td").text(tag);
  //     // console.log(trow);
  // };

  function buildTable_comment(videoID, comment_detail) {
    var table = d3.select("#comment-table");
    var tbody = table.select("tbody");
    var trow;
    trow = tbody.append("tr");
    // trow.append("td").text(videoID);
    // trow.append("td").text(comment_detail);
    trow.append("td").html("<textarea id='testBox'>" + comment_detail + "</textarea>");;
  };

  function buildTable(views, comments, likes, dislikes, publishedAt, title, description, channelTitle, channelId, videoID) {
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    var trow;
    trow = tbody.append("tr");
    trow.append("td").html("<iframe width='400' height='310' src='https://www.youtube.com/embed/" + videoID + "'></iframe>");
    trow.append("td").text(title);
    trow.append("td").text(channelTitle);
    trow.append("td").text(description);
    trow.append("td").text(publishedAt);
    trow.append("td").text(views);
    trow.append("td").text(comments);
    trow.append("td").text(likes);
    trow.append("td").text(dislikes);
  }
}
// Triggered by this line: request.execute(onSearchResponse);
function onSearchResponse_most_view(response) {
  // var responseString = JSON.stringify(response, '', 2);
  // document.getElementById('response').innerHTML = responseString;
  video_id_list = [];
  for (var i = 0; i < response.items.length; i++) {
    //store each JSON value in a variable

    var publishedAt = response.items[i].snippet.publishedAt;
    var channelId = response.items[i].snippet.channelId;
    var title = response.items[i].snippet.title;
    var description = response.items[i].snippet.description;
    var channelTitle = response.items[i].snippet.channelTitle;
    var videoID = response.items[i].id;
    video_id_list.push(videoID);
    var video = "<iframe width='420' height='315' src='https://www.youtube.com/embed/" + videoID + "'></iframe>";
  
  }

  for (var i = 0; i < video_id_list.length; i++) {
    // function search_comment() {
    var request = gapi.client.youtube.commentThreads.list({
      part: 'snippet',
      textFormat: "plainText",
      videoId: video_id_list[i],
      maxResults: 1,
      order: "relevance"
    });
    request.execute(onSearchResponse_comment);
    // console.log(video_id_list[i]);
  }
  comments_list = [];
  function onSearchResponse_comment(responsee) {
    // var responseString = JSON.stringify(response, '', 2);
    // document.getElementById('response').innerHTML = responseString;

    for (var i = 0; i < responsee.items.length; i++) {
      var comment_detail = responsee.items[i].snippet.topLevelComment.snippet.textDisplay;
      comments_list.push(comment_detail);
      var videoID = responsee.items[i].snippet.videoId;
      // console.log(comment_detail);
    }
    buildTable_comment(videoID, comment_detail);
  }

  function buildTable_comment(videoID, comment_detail) {
    var table = d3.select("#comment-table");
    var tbody = table.select("tbody");
    var trow;
    trow = tbody.append("tr");
    // trow.append("td").text(videoID);
    // trow.append("td").text(comment_detail);
    trow.append("td").html("<textarea id='testBox'>" + comment_detail + "</textarea>");;
  };
}



