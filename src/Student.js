import React, { Component } from 'react';

import { joinRoom, askQuestion, onClearAll, onQuestionAnswered} from './api';
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

function Questions(props) {
  let questions = props.value;
  let ret = questions.map((question) =>
    //<li>{question}<button onClick={()=>askQuestion(question)}>ASK</button></li>
    <div class="question">
      <p>{question}</p>
      <button onClick={()=>askQuestion(question)}>ASK</button>
    </div>
  );
  //let ret = <li>{questions}</li>
  return ret;
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

    onQuestionReceived(questionTally => {
      let questions = this.state.questions;
      if (questions.indexOf(questionTally.question) < 0) {
          questions.push(questionTally.question);
          this.setState({data: this.state.data, questions: questions});
      }
    });

    onClearAll(() => {
          this.setState({
            data: this.state.data,
            questions: []
          });
    });

    onQuestionAnswered(question => {
        let questions = this.state.questions;
        questions.splice(questions.indexOf(question), 1);
        this.setState({data: this.state.data, questions: questions});
    })
  }

  componentDidMount(){
      joinRoom("TEMP");
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
        <div id="Understand">
          <h2>I DON'T UNDERSTAND</h2>
          <button onClick={()=>askQuestion("I don't understand")}>ASK</button>
        </div>
        <div id="Example">
          <h2>Could you give an example?</h2>
          <button onClick={()=>askQuestion("Could you give an example?")}>ASK</button>
        </div>
        <div id="Slower">
          <h2>Could you slow down?</h2>
          <button onClick={()=>askQuestion("Could you slow down?")}>ASK</button>
        </div>
        <div id="Faster">
          <h2>Could you speed up?</h2>
          <button onClick={()=>askQuestion("Could you speed up?")}>ASK</button>
        </div>
        <Questions value={this.state.questions}/>
      </div>
    );
  }
}

export default Student;
