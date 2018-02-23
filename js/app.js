/*
  Please add all Javascript code to this file.
*/

/*
  Source: NY Times Top Stories
  Info: https://api.nytimes.com/svc/news/v3/content/content.json
  API Key: 3d880d5967c649b595beb5e5eaba12ae
  Image Source: multimedia: [ { url: ..., format: "Standard Thumbnail" }, ... ]
  Category:
  A Number:
  Article Text (for pop-up screen):
  Article link:
*/
function getNyt() {

  var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
  url += '?' + $.param({'api-key': "3d880d5967c649b595beb5e5eaba12ae"});
  var results = [];
  $.ajax({
    url: url,
    method: 'GET'
  }).done(function (result) {
    var resultSet = result["results"];
    for (i = 0; i < resultSet.length; i++) {
      results.push({
        title: resultSet[i]["title"],
        content: resultSet[i]["abstract"],
        link: resultSet[i]["url"],
        imageSource: getNytImage(resultSet[i]["multimedia"]).url,
        category: getNytCategory(resultSet[i]),
        length: resultSet[i]["abstract"].length
      });
    };
    for (i = 0; i < results.length; i++) {
      buildArticle(results[i]);
    }
  }).fail(function (err) {
    console.log(err);
  });
  return results;

  // Get a thumbnail image from a NYT multimedia object
  function getNytImage(mediaObj) {
    return mediaObj.find(function (obj) {
      return obj["format"] == "Standard Thumbnail";
    });
  }

  // Get the category
  function getNytCategory(resultObj) {
    var category = resultObj["section"];
    if (resultObj["subsection"].length > 0) {
      category += " - " + resultObj["subsection"];
    }
    return category;
  }
}

/*
  Source: Financial Times
  Info: https://developer.ft.com/portal/headline-licence
  API Key: 59cbaf20e3e06d3565778e7b3eea8499b81a49bbaf7ba01c19fe21a1
  Image Source:
  Category:
  A Number:
  Article Text (for pop-up screen):
  Article link:

*/
function getFT() {
  var ftKey = "59cbaf20e3e06d3565778e7b3eea8499b81a49bbaf7ba01c19fe21a1";
  var url = "http://api.ft.com/content/search/v1";
  var data = {
    "queryString": "banks",
    "resultContext": {
      "aspects": ["title", "lifecycle", "location", "summary", "editorial"]
    }
  };
  $.ajax({
    url: url,
    headers: {"X-Api-Key": ftKey, "Content-Type": "application/json"},
    contentType: "application/json",
    dataType: "jsonp",
    data: data,
    method: "POST"
  }).done(function (msg) {
    console.log(msg);
  });

}

/*
  data = Standard Article:
  {
    title: article title (string),
    content: article abstract or full text (string),
    link: url to article (string),
    imageSource: url to thumbnail image (string),
    category: article category (string),
    length: full text article length or abstract length (integer)
  }
 */
function buildArticle(data) {
  var articleSec = '<article class="article">' +
    '<section class="featuredImage">' +
    '<img src="'+data.imageSource+'" alt="" />' +
    '</section>' +
    '<section class="articleContent">' +
    '<a href="#"><h3>'+data.title+'</h3></a>' +
    '<h6>'+ data.category +'</h6>' +
    '</section>' +
    '<section class="impressions">' +
    data["length"] +
    '</section>' +
    '<div class="clearfix"></div>' +
    '</article>';
  $('#main').append(articleSec);
}

$(document).ready(function () {
  $('a[href$="#nyt"]').click(function () {
    var nyt = getNyt();
  })
});

