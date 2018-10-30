import React, { Component } from 'react';

import { askQuestion, onClearAll } from './api';
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
  return '<div class="question">' +
           '<p>' + question + '</p>' +
         '</div>';
}

function Questions(props) {
  let i;
  let questions = props.value;
  let res = "<div id='questions'>";
  // if (questions.length > 0) {
  //   res = <div class="question"><p>{questions[questions.length-1]}</p></div>
  // }
  for (i = 0; i < questions.length; i++) {
    res = res + makeQuestion(questions[i]);
  }
  res = res + '</div>'
  let jsx_res = htmlToReactParser.parse(res);
  return (
    jsx_res
  );
}

var jsx_page = htmlToReactParser.parse(html_page);
var jsx_header = htmlToReactParser.parse(header);
class Student extends Component {

  constructor(props) {
    super(props);
    this.state = {
     data: '',
     questions: []
    }
    this.updateQuestionField = this.updateQuestionField.bind(this);
    this.ask = this.ask.bind(this);
    console.log("Haya Q");

    onQuestionReceived((err, questionTally) => {
      let questions = this.state.questions;
      questions.push(questionTally.question);
      this.setState({data: this.state.data,
        questions: questions});
    });

    onClearAll(() => {
          this.setState({
            data: this.state.data,
            questions: []
          });
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
          <br/>
          <p id="faq_button" onClick={()=>{
            let faq_questions = document.getElementById("faq_questions");
            let faq_button = document.getElementById("faq_button");
            if (faq_questions.style.display === "none") {
              faq_questions.style.display = "block";
              faq_button.innerHTML = "hide FAQ";
            } else {
              faq_questions.style.display = "none";
              faq_button.innerHTML = "show FAQ";
            }
          }}>show FAQ</p>
          <div id="faq_questions">
            <p onClick={()=>askQuestion("I don't understand")}>
              I DON&#39;T UNDERSTAND
            </p>
            <p onClick={()=>askQuestion("Could you give an example?")}>
              Could you give an example?
            </p>
            <p onClick={()=>askQuestion("Could you slow down?")}>
              Could you slow down?
            </p>
            <p onClick={()=>askQuestion("Could you speed up?")}>
              Could you speed up?
            </p>

          </div>
        </div>
        <Questions value={this.state.questions} />
      </div>
    );
  }
}

export default Student;
