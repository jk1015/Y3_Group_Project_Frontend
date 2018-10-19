'<html>' +
  '<head>' +
    '<script src="/socket.io/socket.io.js"></script>' +
    '<script>' +
      'var socket = io();' +
      'socket.on("question received", function(res){' +
         'printResult(res.question)' +
      '});' +
      'function printResult(message) {' +
        'document.getElementById("res").innerHTML = message;' +
      '}' +
    '</script>' +
  '</head>' +
  '<body>' +
    '<div>' +
    '<p>Student Haya</p>' +
    '<p id="res"></p>' +
    '<button onClick="{() => this.ask()}">Ask</button>' +
    '</div>' +
  '</body>' +
'</html>' 
