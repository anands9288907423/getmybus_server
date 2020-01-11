var http = require('http');
const mbxClient = require('@mapbox/mapbox-sdk');
var polyline = require('@mapbox/polyline');
const mbxDirection = require('@mapbox/mapbox-sdk/services/directions');
var url = require('url');

    // creating mapbox client
    const baseClient = mbxClient({ accessToken: "pk.eyJ1IjoiYW5hbmQ5Mjg4IiwiYSI6ImNrNHk2dHJpdDA3dHEzZm82Y2hnY252cjEifQ.W-3fm0taJg_noVA_zzJO7g" });
    const direction_service = mbxDirection(baseClient);
    var jsonObj = [];
    var waypoints_array="2.6;1.5";
    // creating a for loop 
 
exports.Mycloud = http.createServer(function (req, res) {
  var q = url.parse(req.url, true).query;
  var txt = q.waypoints;
  if(txt!=undefined){
    console.log(txt);
  console.log("my ft call");
    waypoints_array = txt.split(';');
  console.log(waypoints_array[0],"way point test")
  for(i=0;i<waypoints_array.length;i++){
    value = waypoints_array[i];
    console.log(value,"for each");
    cords = value.split(",");
    item = {}
    item["coordinates"] = [Number(cords[0]),Number(cords[1])];
    console.log(item,"obj created");
    jsonObj.push(item);
  }
    
    console.log(jsonObj,"the js array")

    direction_service.getDirections({
      profile: 'driving-traffic',
      waypoints: jsonObj
    })
        .send()
        .then(responses => {
          // response.send("hai");
          const directions = responses.body;
          var ans = polyline.toGeoJSON(directions.routes[0].geometry);
          console.log(ans);
          res.write(JSON.stringify(ans));
          res.end();
          jsonObj.length = 0;
          // // need to be send to the Android application for display routes in google maps android phone
          // console.log(polyline.toGeoJSON(directions.routes[0].geometry).coordinates);
          // response.send(polyline.toGeoJSON(directions.routes[0].geometry))
        })
        .catch(() => {
          res.write("some bad happend");
          console.error('Do that');
          res.end();
      })
  // res.write('Hello World!');
  // res.end();
  }
  else{
    res.write("plese keep not empty");
    res.end();
  }
}).listen(process.env.PORT || 5000);