import React, { Component } from 'react';

import { askQuestion,
  onClearAll,
  connectLecturer,
  onQuestionAnswered,
  stopAsking,
  onQuestionReceived,
  Header} from './api';

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

function makeQuestion(question) {
  return '<div class="question">' +
           '<p>' + question + '</p>' +
         '</div>';
}

function Questions(props) {
  // let i;
  // let questions = props.value;
  // let res = "<div id='questions'>";
  // // if (questions.length > 0) {
  // //   res = <div class="question"><p>{questions[questions.length-1]}</p></div>
  // // }
  // for (i = 0; i < questions.length; i++) {
  //   res = res + makeQuestion(questions[i]);
  // }
  // res = res + '</div>'
  // let jsx_res = htmlToReactParser.parse(res);
  // return (
  //   jsx_res
  // );


}

var jsx_page = htmlToReactParser.parse(html_page);
var jsx_header = htmlToReactParser.parse(header);

class Student extends Component {

  constructor(props) {
    super(props);

    this.state = {
       data: '',
       questionMap: new HashMap(),
       myQuestions: []
    }

    this.updateQuestionField = this.updateQuestionField.bind(this);
    this.ask = this.ask.bind(this);
    this.removeAsk = this.removeAsk.bind(this);

    connectLecturer('TEMP', questionMap =>{
      let map = new HashMap();
      map.copy(questionMap)
      this.setState({
          questionMap: map
      })
    });

    onQuestionReceived(questionTally => {
      let map = this.state.questionMap;

      if(questionTally.number <= 0)
        map.delete(questionTally.question)
      else
        map.set(questionTally.question, questionTally.number);

      this.setState({
          questionMap: map
      })
    });

    onClearAll(() => {
      this.setState({
        questionMap: new HashMap()
      });
    });

    onQuestionAnswered(question => {
      let questionMap = this.state.questionMap;
      if (questionMap.has(question)) {
         questionMap.delete(question);
      }

      this.setState({
        questionMap: questionMap
      });
    });
  }

  ask(){
    askQuestion(this.state.data);
    this.setState({data: ''});

    let newMyQ = this.state.myQuestions.map(d=>({...d}));
    newMyQ.push(this.state.data);
    this.setState({myQuestions: newMyQ});
  }

  updateQuestionField(e) {
    this.setState({data: e.target.value});
  }

  removeAsk(question){
    stopAsking(question);
    let newMyQ = this.state.myQuestions.map(d=>({...d}));
    newMyQ = newMyQ.filter((q) => q !== question)
    this.setState({myQuestions: newMyQ});
  }

  render() {
    var questions = [];

    this.state.questionMap.keys().forEach(
      function(key) {
        questions.push([key, this.state.questionMap.get(key)]);
      }, this)

    questions.sort(
      function(a, b) {
        return b[1] - a[1];
      }
    )

    var questionList = questions.map((question) =>
      <div class="question" key={question[0]}>
        {question[0]}: {question[1]}
        {!this.state.myQuestions.includes(question[0])?
          <button class="button_info" onClick={()=>this.ask(question[0])}>Ask</button>:
          <button class="button_info" onClick={()=>this.removeAsk(question[0])}>Stop Asking</button>
        }
      </div>
    );


    return (
      <div>
        <Header value="Student"/>
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
              faq_button.innerHTML = "hide FAQ &#9652;";
            } else {
              faq_questions.style.display = "none";
              faq_button.innerHTML = "show FAQ &#9662;";
            }
          }}>show FAQ &#9662;</p>
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

        <div>{questionList}</div>
        {/* <Questions value={this.state.questions} /> */}
      </div>
    );
  }
}

export default Student;
