import React, { Component } from 'react';

import { askQuestion } from './api';
import { onQuestionReceived } from './api';
//var student_page = require('./student.html.js');
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
const HashMap = require('hashmap');
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

// onQuestionReceived(printMsg());
//
// function printMsg(q) {
//   console.log(q);
// }

function Header() {
  return (
    <div id="header">
      <p>Student Room</p>
    </div>
  );
}

function makeQuestion(question) {
  return <div class="question">
           <p>{question}</p>
         </div>;
}

function Questions(props) {
  let i;
  let questions = props.value;
  let res = <p>No questions received! {questions[questions-1]}</p>;
  if (questions.length > 0) {
    res = <p>{questions[questions.length-1]}</p>
  }
  console.log("Haya Q");

  for (i = 0; i < questions.length; i++) {
//    questions.push(makeQuestion());
//    res = <p>res{questions.get(i)}</p>
  }

  return (
    res
  );
}

var jsx_page = htmlToReactParser.parse(html_page);
var jsx_header = htmlToReactParser.parse(header);
class Student extends Component {

  constructor(props) {
    super(props);
    this.state = {
     data: 'Question',
     questions: []
    }
    this.updateQuestionField = this.updateQuestionField.bind(this);
    this.ask = this.ask.bind(this);
    console.log("Haya Q");

    onQuestionReceived((err, questionTally) => {
      let questions = this.state.questions;
      questions.push(questionTally.question);
      this.setState({data: this.state.data + questions.length,
        questions: questions});
    });
  }

  componentDidMount(){
//    askQuestion("I don't understand");
  }

  ask(){
    askQuestion(this.state.data);
  }

  updateQuestionField(e) {
    this.setState({data: e.target.value, questions: this.state.questions});
  }

  render() {
    return (
      <div>
        <Header />
        <div id="Question_box">
          <h2>ASK A QUESTION</h2>
          <form id="Question_form">
            <input name="question" type="text" value={this.state.data}
              onChange={this.updateQuestionField}/>
          </form>
          <button onClick={this.ask}>ASK</button>
        </div>
        <Questions value={this.state.questions} />
      </div>
    );
  }
}

export default Student;
