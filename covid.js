Promise.all([
  fetch("https://api.covid19india.org/v4/min/data.min.json"),
  fetch('https://api.covidindiatracker.com/total.json'),
  fetch('https://api.covid19india.org/state_district_wise.json')
]).then(function (responses) {
	  return Promise.all(responses.map(function (response) {
	  	return response.json();
	  }));
}).then(function (data) {
       //dd(data[2])
      card(data[1]) 
      show_data(data[0], dd(data[2]))
}).catch(function (error) {
	console.log(error);
});
var result = []
var data_obj = {}
var object = {}
var district = ["Madurai", "Ganjam", "Alappuzha", "Mumbai", "Chennai"]
var state_name = ["Andhra Pradesh", "Karnataka", "Gujarat", "West Bengal", "lakdakh"]
var sts_list = document.getElementById("state_list");
var dis_list = document.getElementById("dis_list");
for (var x=0; x < district.length; x++) {
  var ele = document.createElement("li");
  ele.setAttribute("id", "input");
  var txt = document.createTextNode(" " + district[x])
  ele.appendChild(txt);
  dis_list.appendChild(ele)
}
for (var x=0; x < state_name.length; x++) {
  var ele = document.createElement("li");
  ele.setAttribute("id", "input");
  var txt = document.createTextNode(" " + state_name[x])
  ele.appendChild(txt);
  sts_list.appendChild(ele)
}
function hide_search() { 
  var ele = document.getElementById("hide_con");
  var input = document.getElementById("input");
  window.onclick = function(event) {
    if (event.target == input){
      ele.style.display = "inline-flex";
    }else {
      ele.style.display = "none";
    }
  }
}

function hide_content() {
  document.getElementById("map").style.display= 'none';
  var elms = document.querySelectorAll("[id='hide_row']");
  for (var i = 0; i < elms.length; i++) {
    if (elms[i].style.display === "none") {
      elms[i].style.display= "table-cell";
      document.getElementById("arrow").className = "fas fa-arrow-left";
    } else {
      elms[i].style.display = "none";
      document.getElementById("arrow").className = "fas fa-arrow-right";
      document.getElementById("map").style.display= 'block';
    }
  }
}

function nav_link() { 
  ele = document.getElementById("");
  input = document.getElementById("input");
  window.onclick = function(event) {
    if (event.target == input) {
      ele.style.display = "inline-flex";
    }else {
      ele.style.display = "none";
    }
  }
}
function dd(data){
  abz = {}
  a = []
  var code = Object.getOwnPropertyNames(data);
  dis_array = data[code];
  for( var x in code) {
    o = {}
    z = code[x]
    o["state_code"] = z
    o["state_array"] = data[z].statecode;
    abz["o"] = o
  }
 return(abz)
}
function show_data(data, array) {
  var state_code = Object.getOwnPropertyNames(data);
  for (x in state_code) {
    var state = state_code[x]
    var obj = {}
    var state_data = data[state]
    obj["state_array"] = state
    obj["population"] = state_data.meta.population.toLocaleString();
    obj["confirmed"] = state_data.total.confirmed.toLocaleString();
    obj["recovered"] = state_data.total.recovered.toLocaleString();
    obj["recovery_ratio"] = ((state_data.total.recovered*100)/state_data.total.confirmed).toFixed(1);
    obj["case_fatality"] = ((state_data.total.deceased*100)/state_data.total.confirmed).toFixed(1);
    obj["tested"] = state_data.total.tested.toLocaleString();
    if (state_data.total.deceased) {
      obj["deceased"] = state_data.total.deceased.toLocaleString();
    }
    if(state_data.delta) {
      obj["delta_confirmed"] = state_data.delta.confirmed;
      obj["delta_recovered"] = state_data.delta.recovered;
      obj["delta_deceased"] = state_data.delta.deceased;
    }
    console.log(obj)
    console.log(obj.delta_confirmed)
    result.push(obj);
    }
  object["result"]= result;
  var template = document.getElementById("template").innerHTML;
  var text = Mustache.render(template, object);
  document.getElementById("body").innerHTML = text;
}

function card(data) {
  var obj = {}
  obj["data"] = data  
  var template = document.getElementById("total_data").innerHTML;
  var text = Mustache.render(template,obj);
  document.getElementById("map_card").innerHTML = text;
}

function show() {
  var navbar = document.querySelectorAll("[id='1']")
  document.getElementById("n_hide").style.width = "300px";
  for (var i = 0; i < navbar.length; i++) {
    navbar[i].style.visibility= "visible";
    navbar[i].style.margin = "0px 0px 0px 80px";
  }
}

function hide() {
  var navbar = document.querySelectorAll("[id='1']")
  document.getElementById("n_hide").style.width = "100px";
  for (var i = 0; i < navbar.length; i++) {
    navbar[i].style.visibility= "hidden";
  }
}