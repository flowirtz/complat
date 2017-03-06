var ws = require("nodejs-websocket");
var fs = require("fs");
var problemList=[];
var userdict;
var exec = require('child_process').exec;

var server = ws.createServer(function (conn) {
  console.log("New Con");
  conn.on("text", function (str) {
    console.log("Received " + str);
    var obj = JSON.parse(str);
    if (obj.type == "problem") {
      problemList.push(obj);
      problemList[problemList.length - 1].problemID = problemList.length - 1;
      exec('phonegap push --deviceID fhHuY121FMY:APA91bHjBk_5U0bWe7u4nZDMKhVv8px30u1KZWxJ71xol9lGXhveHoWlprCqfc9DVrtnUsRlPB9lV3GPll_4UsuIw5jcnzP17ln5vZY7zryuEgJZnd2qq8XRPJY6GLBlrMKkRem2hPAx --service gcm --payload \'{ "data": { "title": "Problem with machine"' + obj.machineID + ', "message": '+ obj.description +'}\'');
      console.log("notified a receiver");
    } else if (obj.type == "solution") {
      problemList[obj.problemID].solved = obj.submitterID;
      problemList[obj.problemID].solution = obj.solution;

    } else if (obj.type == "list_request") {
      console.log(problemList)
      conn.sendText(JSON.stringify({list:problemList}));
    }

  });
  conn.on("close", function (code, reason) {
    console.log(reason);
  });
}).listen(3001);
