var ws = require("nodejs-websocket");
var fs = require("fs");
var problemList=[];
var server = ws.createServer(function (conn) {
  console.log("New Con");
  conn.on("text", function (str) {
    console.log("Received " + str);
    var obj = JSON.parse(str);
    if (obj.type == "problem") {
      problemList.push(obj);
      problemList[problemList.length - 1].problemID = problemList.length - 1;
      //notify...
    } else if (obj.type == "solution") {
      problemList[obj.problemID].solved = true;
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
