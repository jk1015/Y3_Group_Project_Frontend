import React, { Component } from 'react';

import { askQuestion } from './api';
//var student_page = require('./student.html.js');
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
var html_page =
      '<script src="/socket.io/socket.io.js"></script>' +
      '<script>' +
        'var socket = io();' +
        'socket.on("question received", function(res){' +
           'printResult(res.question)' +
        '});' +
        'function printResult(message) {' +
          'document.getElementById("res").innerHTML = message;' +
        '}' +
        'function ask() {' +
          'socket.emit("question asked", "just a // QUESTION: ")' +
        '}' +
      '</script>' +
      '<div>' +
        '<p>Student Haya</p>' +
        '<p id="res"></p>' +
        '<button onclick="this.ask()">Ask</button>' +
        '<script>' +
          'ask();' +
        '</script>' +
      '</div>';
var header =
  '<div id="header">' +
    '<p>Student Section</p>' +
  '</div>';

function Header() {
  return (
    <div id="header">
      <p>Student Room</p>
    </div>
  );
}

var jsx_page = htmlToReactParser.parse(html_page);
var jsx_header = htmlToReactParser.parse(header);
class Student extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount(){
//    askQuestion("I don't understand");
  }

   ask(){
    askQuestion("I don't understand");
   }

  render() {
    return (
      <Header />
    );
  }
}

export default Student;
