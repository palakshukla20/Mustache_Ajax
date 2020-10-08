 function onclick() {
  obj = {}
  var http_request = new XMLHttpRequest();
  http_request.onreadystatechange = function() {
    if (http_request.readyState == 4 ) {
      var data = JSON.parse(http_request.responseText);
      obj["data"] = data      
      var template = document.getElementById("total_data").innerHTML;
      var text = Mustache.render(template,obj);
      document.getElementById("map_card").innerHTML = text;
    }
  }
  http_request.open("GET", "https://api.covidindiatracker.com/total.json", true);
  http_request.send();
}