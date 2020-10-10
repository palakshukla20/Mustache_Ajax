Promise.all([
  fetch("https://api.covid19india.org/v4/min/data.min.json"),
  fetch('https://api.covid19india.org/state_district_wise.json')
]).then(function (responses) {
  return Promise.all(responses.map(function (response) {
    return response.json();
  }));
}).then(function (data) {
  showData(data[0], data[1])
}).catch(function (error) {
  console.log(error);
});
$(document).ready(function () {
  $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});

var result = []
var data_obj = {}
var object = {}
var district = ["Madurai", "Ganjam", "Alappuzha", "Mumbai", "Chennai"]
var state_name = ["Andhra Pradesh", "Karnataka", "Gujarat", "West Bengal", "lakdakh"]
var sts_list = document.getElementById("state_list");
var dis_list = document.getElementById("dis_list");

for (var x = 0; x < district.length; x++) {
  var ele = document.createElement("li");
  ele.setAttribute("id", "input");
  var txt = document.createTextNode(" " + district[x])
  ele.appendChild(txt);
  dis_list.appendChild(ele)
}

for (var x = 0; x < state_name.length; x++) {
  var ele = document.createElement("li");
  ele.setAttribute("id", "input");
  var txt = document.createTextNode(" " + state_name[x])
  ele.appendChild(txt);
  sts_list.appendChild(ele)
}

a = []
function merge(result, array, tt) {
  abz = {}
  var t_active = 0
  var code = Object.getOwnPropertyNames(array);
  dis_array = array[code];
  for (x in code) {
    z = code[x];
    for (y in result) {
      if (array[z].statecode == result[y].state_array ) {
        active = 0
        result[y].state_name = code[x]
        district_name = array[z].districtData
        for (x in district_name) {
          active += district_name[x].active
        }
        result[y].active = active;
        t_active += active
        result[y].active_ratio = ((active*100)/result[y].con).toFixed(1);
        abz["abc"] = array[z].districtData;
      }
    }
    tt[0].active = t_active.toLocaleString()
  }
  console.log(abz)
}

function convert_rupee(amount) {
  amount = "0" + amount;
  length = amount.length;
  if (length >= 6 && length <= 7) {
    return (amount / 100000).toFixed(1) + 'L';
  } else if (length >= 8 && length <= 11) {
    return (amount / 10000000).toFixed(1) + 'Cr.';
  } else if (length >= 4 && length <= 5) {
    return (amount / 1000).toFixed(1) + 'K';
  } else {
    return 0;
  }
}
var tt =[]
function showData(data, array) {
  var stateCode = Object.getOwnPropertyNames(data);
  for (x in stateCode) {
    var obj       = {}
    var state     = stateCode[x] 
   
    var stateData = data[state]
    if (state == "TT") {
      obj["state_name"]      = "India";
      obj["confirmed"]       = stateData.total.confirmed.toLocaleString();
      obj["recovered"]       = stateData.total.recovered.toLocaleString();
      obj["population"]      = convert_rupee(stateData.meta.population);
      obj["tested"]          = convert_rupee(stateData.total.tested);
      obj["recovery-ratio"]  = ((stateData.total.recovered * 100) / stateData.total.confirmed).toFixed(1);
      obj["case-fatality"]   = ((stateData.total.deceased * 100) / stateData.total.confirmed).toFixed(1);
      obj["deceased"]        = stateData.total.deceased.toLocaleString();
      obj["delta-confirmed"] = stateData.delta.confirmed.toLocaleString();
      obj["delta-recovered"] = stateData.delta.recovered.toLocaleString();
      obj["delta-deceased"]  = stateData.delta.deceased.toLocaleString();
      obj["other"]           = stateData.total.other;
      tt.push(obj);
      object["TT"] = tt;
    } else {
        obj["state_array"]    = state;
        obj["con"]            =  stateData.total.confirmed
        obj["confirmed"]      = stateData.total.confirmed.toLocaleString();
        obj["recovered"]      = stateData.total.recovered.toLocaleString();
        obj["population"]     = convert_rupee(stateData.meta.population);
        obj["tested"]         = convert_rupee(stateData.total.tested);
        obj["other"]          = stateData.total.other;
        obj["recovery-ratio"] = ((stateData.total.recovered * 100) / stateData.total.confirmed).toFixed(1);
        obj["case-fatality"]  = ((stateData.total.deceased * 100) / stateData.total.confirmed).toFixed(1);
        if (stateData.total.deceased) {
          obj["deceased"] = stateData.total.deceased.toLocaleString();
        }
        if (stateData.meta.notes) {
          obj["notes"] = stateData.meta.notes;
        }
        if (stateData.delta) {
          obj["delta-confirmed"] = stateData.delta.confirmed;
          obj["delta-recovered"] = stateData.delta.recovered;
          obj["delta-deceased"]  = stateData.delta.deceased;
        }
        result.push(obj);
      }
  }
  merge(result, array,tt)
  object["result"] = result;
  var template_card = document.getElementById("total_data").innerHTML;
  var text     = Mustache.render(template_card, object);
  document.getElementById("map_card").innerHTML = text;
  var template = document.getElementById("template").innerHTML;
  var text     = Mustache.render(template, object);
  document.getElementById("body").innerHTML = text;
}

function hideSearch() {
  var ele = document.getElementById("hide_con");
  var input = document.getElementById("input");
  window.onclick = function (event) {
    if (event.target == input) {
      ele.style.display = "inline-flex";
    } else {
      ele.style.display = "none";
    }
  }
}
