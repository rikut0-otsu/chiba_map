//======================================================================
// File: app_day3_004_018.js
// Description: Show layers for population on meshes and medical providers (hospitals, clinics, and dentists' offices
// Functions annd Global Variables
//======================================================================
//var code2city = [];
var code2count_all = [];
var code2count_hosp = [];
var code2count = [];
var code2pop2020 = [];
var circleMarkerOptions = {
    radius: 5,
    color: '#ff0000'
};

function meshPopup(feature,layer){
  //console.log(feature.properties.MESH_ID);
  var mesh_id = feature.properties.MESH_ID;
  var city_code = feature.properties.CITY_CODE;
  var pop2020 = feature.properties.POP2020;
  code2pop2020[mesh_id] = pop2020;
  var content = mesh_id+":"+city_code+":"+pop2020;
  layer.bindPopup(content);

};

function newPopup(layer){
  var mesh_id = layer.feature.properties.MESH_ID;
  var city_code = layer.feature.properties.CITY_CODE;
  var count = code2count[mesh_id];
  var pop2020 = code2pop2020[mesh_id];
  var content = mesh_id+":"+city_code + ":" + pop2020 + ":" + count;
  return content;
};

function myPoint(feature,latlng){
   var name = feature.properties.P04_002;
   var dep = feature.properties.P04_004;
   var type = feature.properties.P04_001;
   var mesh_id = getMeshId(latlng);
   //console.log(latlng);
   var content = name + ":<br>" + dep + ":<br>" + mesh_id;
   x = L.circleMarker(latlng,circleMarkerOptions).bindPopup(content);
   return x;
};

function myPoint2(feature,latlng){
  var name = feature.properties.P04_002;
  var dep = feature.properties.P04_004;
  var type = feature.properties.P04_001;
  var mesh_id = getMeshId(latlng);
  //console.log(latlng);
  var content = name + ":<br>" + dep + ":<br>" + mesh_id;
  x = L.circleMarker(latlng,circleMarkerOptions).bindPopup(content);
  return x;
};

function onlyHosp(feature){
   switch (feature.properties.P04_001) {
        case "1": return true;
        default: return false;
   }
};

function newStyle_1 (feature){
    var mesh_id = feature.properties.MESH_ID;
    var count = code2count_hosp[mesh_id];
    return {
       fillColor: color(count),
       weight: 1,
       opacity: 1,
       color: 'white',
       fillOpacity: 0.5
    };
}

function newStyle_2 (feature){
    var mesh_id = feature.properties.MESH_ID;
    var count = code2count_all[mesh_id];
    count = count/10;
    return {
       fillColor: color(count),
       weight: 1,
       opacity: 1,
       color: 'white',
       fillOpacity: 0.5
    };
}

function newStyle_3 (feature){
    var mesh_id = feature.properties.MESH_ID;
    var pop2020 = code2pop2020[mesh_id];
    pop2020 = pop2020/400;
    return {
       fillColor: color(pop2020),
       weight: 1,
       opacity: 1,
       color: 'white',
       fillOpacity: 0.5
    };
}


function orgStyle(feature){
   return {fillColor:'#3388ff'
   };
}



function getMeshId(latlng){
   var lat = latlng.lat;
   var lng = latlng.lng;
   var first = Math.floor(lat*60/40);
   var first_2 = Math.floor(lng - 100);
   var first_2_rest = lng - 100 - first_2;
   var first_rest = lat*60%40;
   var second = Math.floor(first_rest/5);
   var second_2 = Math.floor(first_2_rest*60/7.5);
   var second_rest = first_rest%5;
   var second_2_rest = (first_2_rest*60)%7.5;
   var third = Math.floor(second_rest*2);
   var third_2 = Math.floor(second_2_rest*60/45);
      //console.log(first+":"+first_2+":"+second+":"+second_2+":"+third+":"+third_2+":"+mesh_id);
   var mesh_id = first.toString()+first_2.toString()+second.toString()+second_2.toString()+third.toString()+third_2.toString();
   return mesh_id;
};

function count_1(feature,layer){
  var lat_lng = feature.geometry.coordinates;
  var latlng = L.latLng(lat_lng[1], lat_lng[0]);
  var mesh_id = getMeshId(latlng);
  if (!code2count_all[mesh_id]){
     code2count_all[mesh_id] = 1;
  }
  else {
     code2count_all[mesh_id]++;
  }
};

function count_2(feature,layer){
  var lat_lng = feature.geometry.coordinates;
  var latlng = L.latLng(lat_lng[1], lat_lng[0]);
  var mesh_id = getMeshId(latlng);
  if (!code2count_hosp[mesh_id]){
     code2count_hosp[mesh_id] = 1;
  }
  else {
     code2count_hosp[mesh_id]++;
  }
};

function printOut(){
  var content = "";
  for (var mesh_id in code2pop2020){
       var pop = code2pop2020[mesh_id];
       if (!pop){pop = 0;}
       var count = code2count[mesh_id];
       if (!count){count = 0;}
       content = content+mesh_id+":"+pop+":"+count+"\r\n";
  }
  return content;
};

function color(x){
   return x > 10  ? '#990000' :
   x >  8        ? '#d7301f' :
   x >  6        ? '#ef6548' :
   x >  4        ? '#fc8d59' :
   x >  2       ? '#fdbb84' :
   x >  1        ? '#fdd49e' :
   x >  0        ? '#fee8c8' : '#fff7ec';
}

//======================================================================
// Main function
//======================================================================
jQuery(document.body).ready(function($){
var latlng = [35.6920, 140.0486];
var map = L.map('map', 
{
     center: latlng, 
     zoom: 10,
     preferCanvas: true
});
 
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
var popLayer = L.geoJson(chiba_base_mesh, {
   onEachFeature: meshPopup
});
popLayer.addTo(map).setStyle(newStyle_3);

var medLayer = L.geoJson(people_gather,{
    pointToLayer: myPoint,
    onEachFeature: count_1
});

var hospLayer = L.geoJson(eki,{
    pointToLayer: myPoint,
    // onEachFeature: count_2,
    // filter: onlyHosp
});
var buser = L.geoJson(bus,{
  pointToLayer: myPoint2,
  onEachFeature: count_2,
});

// $("#only_hosp").on('click',function(){
//     code2count = code2count_hosp;
//     map.removeLayer(medLayer);
//     hospLayer.addTo(map);
//     popLayer.bindPopup(newPopup).setStyle
$("#only_hosp").on('click',function(){
  code2count = code2count_hosp;
  map.removeLayer(medLayer);
  buser.addTo(map);
  hospLayer .addTo(map);
  popLayer.bindPopup(newPopup).setStyle(newStyle_3);
    var content = printOut;
    $("#out").text(content);
});
$("#med_all").on('click',function(){
    code2count = code2count_all;
    map.removeLayer(buser);
    map.removeLayer(hospLayer);
    medLayer.addTo(map);
    popLayer.bindPopup(newPopup).setStyle(newStyle_3);
    var content = printOut;
    $("#out").text(content);
});
$("#no_med").on('click',function(){
    code2count = [];
    map.removeLayer(medLayer);
    map.removeLayer(hospLayer);
    map.removeLayer(buser);
    popLayer.bindPopup(newPopup).setStyle(newStyle_3);
});
$("#off_button").on('click', function(){
  map.removeLayer(medLayer);
  map.removeLayer(buser);
});

 
// Do not forget to close the brackets
});