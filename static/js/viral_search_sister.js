
// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}
// Called automatically when YouTube API interface is loaded 
function onYouTubeApiLoad() {
  gapi.client.setApiKey('AIzaSyAUlDVsMCBRcnIrKfvdSk5v7pDvpxoFpY8');
}

// Called when the search button is clicked in the html code
function search_most_view_sister() {
  var query = document.getElementById('autocomplete-default').value;
  // Use the JavaScript client library to create a search.list() API call.
  var request = gapi.client.youtube.search.list({
    part: 'snippet',
    order: 'viewCount',
    maxResults: 50,
    q: query
  });
  // Send the request to the API server, call the onSearchResponse function when the data is returned
  request.execute(onSearchResponse_most_view_sister);
}

// Triggered by this line: request.execute(onSearchResponse);
function onSearchResponse_most_view_sister(response) {

  video_id_list = [];
  des = [];
  titles = [];
  views_count = [];
  like_count = [];
  for (var i = 0; i < response.items.length; i++) {
    //store each JSON value in a variable

    var publishedAt = response.items[i].snippet.publishedAt;
    var channelId = response.items[i].snippet.channelId;
    var title = response.items[i].snippet.title;
    titles.push(title);
    var description = response.items[i].snippet.description;
    des.push(description);
    var channelTitle = response.items[i].snippet.channelTitle;
    var videoID = response.items[i].id.videoId;
    video_id_list.push(videoID);
    var video = "<iframe width='420' height='315' src='https://www.youtube.com/embed/" + videoID + "'></iframe>";
    console.log(videoID);


    buildTable_most_view_sister(publishedAt, title, description, channelTitle, channelId, videoID);
  }

  // var obj2 = titles.toString();
  var obj2 = des.toString();

  function wordCount(myString) {
    var stringArray = myString.split(" ");
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

  var stopwords = ['-', ',', ':', 'become', 'might','|', '(', 'For', 'for', 'The', 'the',
    'Of', 'of', '&', '&amp;', 'My', 'To', 'to', 'With', 'with',
    'video','videos','And','!','see','Video','Videos',
    'will', 'to', 'on', 'and', 'a', 'Asia&#39;s', 'from', 'l',
    'ft.', 'In', 'in', 'We', 'we', 'Are', 'are', '/', 'I', 'A', 'You', 'you',
    'Will', 'Have', 'Wanna', 'at', 'What','If','if','If','New','new',
    'every','Every','get','lot','de','el','Watch','watch','Subscribe',
    'subscribe','time','things','look','back','like','video,','please',
    'NOW','Now','now',"Let's",
    'i', 'me', 'my', 'myself', 'we', 'our', 'THE', '...,The',
    'ours', 'ourselves', 'you', 'your', 'yours', 'yourself',
    'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
    'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what',
    'which', 'who', 'whom', 'This', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was',
    'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did',
    'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while',
    'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
    'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
    'should', 'now'];

  function remove_stopwords(str) {
    res = []
    words = str.split(' ')
    for (i = 0; i < words.length; i++) {
      if (!stopwords.includes(words[i])) {
        res.push(words[i])
      }
    }
    return (res.join(' '))
  }
  var obj1 = remove_stopwords(obj2);

  // var a= remove_stopwords("I will go to the place where there are things for me.");
  // console.log(a);
  var obj = wordCount(obj1);
  // console.log(wordCount(obj));
  var myWords = Object.entries(obj).map((k, v) => { return { "word": (k.slice(0, 1)).toString(), "size": (k.slice(1, 2)).toString() } });
  console.log(myWords);
  var myWords_top = myWords.sort(function (a, b) {
    return parseFloat(b.size) - parseFloat(a.size);
  });

  // Slice the first 10 objects for plotting
  myWords_top1 = myWords_top.slice(0, 20);

  // Reverse the array due to Plotly's defaults
  myWords_top10 = myWords_top1.reverse();
  myWords_top11 = myWords_top10.reverse();


  // set the dimensions and margins of the graph
  var margin = { top: 50, right: 10, bottom: 160, left: 10 },
    width = 890 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

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
    height = 700 - margin.top - margin.bottom;

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
    .domain([0, 30])
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
    .text("Top Word Frequency- Description Section")
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
    request.execute(onSearchResponse_most_view_comment);

  }
  comments_list = [];
  function onSearchResponse_most_view_comment(responsee) {
    for (var i = 0; i < responsee.items.length; i++) {
      var comment_detail = responsee.items[i].snippet.topLevelComment.snippet.textDisplay;
      comments_list.push(comment_detail);
      var videoID = responsee.items[i].snippet.videoId;
      //   console.log(comment_detail);
    }
    buildTable_most_view_comment(videoID, comment_detail);
  }

  function buildTable_most_view_comment(videoID, comment_detail) {
    var table = d3.select("#comment-table");
    var tbody = table.select("tbody");
    var trow;
    trow = tbody.append("tr");
    trow.append("td").html("<textarea id='testBox'>" + comment_detail + "</textarea>");;
  };

  function buildTable_most_view_sister(publishedAt, title, description, channelTitle, channelId, videoID) {
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    var trow;
    trow = tbody.append("tr");
    trow.append("td").html("<iframe width='400' height='310' src='https://www.youtube.com/embed/" + videoID + "'></iframe>");
    trow.append("td").text(title);
    trow.append("td").text(channelTitle);
    trow.append("td").text(description);
    trow.append("td").text(publishedAt);
  }
}



