//import * as $ from "jquery";
/// <reference path = "main.d.ts" />   
class State { 
  stateName:string;
  stateCode:string; 
  confirmed:number;
  active:number;
  recovered:number; 
  deceased:number;
  lastUpdate:Date;
  constructor() {}
  getData(value: any) {
    var state_data:string = "";
    state_data += '<tr>';
    state_data += '<th>' + value.state + '</th>';
    state_data += '<td>' + value.confirmed + '</td>';
    state_data += '<td>' + value.active + '</td>';
    state_data += '<td>' + value.recovered + '</td>';
    state_data += '<td>' + value.deaths + '</td>';
    state_data += '<td>' + value.migratedother + '</td>';
    state_data += '<tr>';
    return state_data;
  }
  mapTemplate (result:any):void {
    $('#card-state-name').html(result.stateName)
    $('#confirmed').html(result.confirmed);
    $('#active').html(result.active);
    $('#recovered').html(result.recovered);
    $('#deceased').html(result.deceased);
    $('#last-update').html(result.lastUpdate);
  }

  getMapData(value:any):any {
    return {
      stateName: value.state, 
      stateCode: value.statecode, 
      confirmed: value.confirmed, 
      active: value.active, 
      recovered: value.recovered, 
      deceased: value.deaths,
      lastUpdate: new Date(value.lastupdatedtime).toDateString()
    }    
  }
}
var result:any = [];
var state = new State();

$.ajax ({
  url: 'https://api.covid19india.org/data.json',
  complete: function(response) {
    var data = JSON.parse(response.responseText);
    var searchTags = [];
    var total =[]
    for (let x in data) {
      if (x == "statewise") {
        $.each(data[x], function(key, value) {
          if (value.statecode === "TT") {
            searchTags.push("India");
            console.log(value)
            total.push({stateName: "India", stateCode: value.statecode, confirmed: value.confirmed, active: value.active, recovered: value.recovered, deceased: value.deaths, lastUpdate: value.lastupdatedtime});
          } else {
            searchTags.push(value.state);
            result.push(state.getMapData(value));
            $('#body').append(state.getData(value));
          }
        });
        searchTags.sort();
      }
    }
    (<any>$("#searchBar")).autocomplete({
      source: searchTags
    });
    state.mapTemplate(total[0])
    $.each(result, function(key, value) {
      var optionText = value.stateName;
      var optionValue = value.stateCode
      $('.select-state').append(new Option(optionText, optionValue));
    });
  },
  error: function() {
    $('#output').html('There was an error!');
  },
});

$("#searchBar").on("change", function() {
  var stateName = $("#searchBar").val();
  for (let i in result) {
    if (result[i].stateName === stateName) {
      state.mapTemplate(result[i])
    }
  }
})

$('.Navbar').on('mouseenter', function() {
  $('.Navbar').toggleClass('nav-expand');
})
$('.Navbar').on('mouseleave', function() {
  $('.Navbar').removeClass('nav-expand');
})

$('.sort-table-left-ques').on('click',function() {
  $(".sort-table-ques").toggle();
})

function isActive(e:Event) {
  if($('.map-card div').hasClass('active')) {
    var ele = $('.active');
    $(ele).removeClass('active');
  }
  $(e).addClass('active');
}
