import React, { Component } from 'react';

import { askQuestion,
  onClearAll,
  connectLecturer,
  onQuestionAnswered,
  stopAsking,
  onQuestionReceived,
  onDisconnect,
  Header,
  Footer
} from './api';

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
       myQuestions: [],
       room: this.props.value
    }

    this.updateQuestionField = this.updateQuestionField.bind(this);
    this.ask = this.ask.bind(this);
    this.removeAsk = this.removeAsk.bind(this);

    connectLecturer(this.state.room, questionMap =>{
      let map = new HashMap();
      map.copy(questionMap)
      this.setState({
          questionMap: map,
          room: props.value
      })
    });

    onQuestionReceived(questionTally => {
      let map = this.state.questionMap;

      if(questionTally.number <= 0)
        map.delete(questionTally.question)
      else
        map.set(questionTally.question, questionTally.number);

      this.setState({
          questionMap: map,
          room: this.state.room
      })
    });

    onClearAll(() => {
      this.setState({
        questionMap: new HashMap(),
        room: this.state.room
      });
    });

    onQuestionAnswered(question => {
      let questionMap = this.state.questionMap;
      if (questionMap.has(question)) {
         questionMap.delete(question);
      }
      if (this.state.myQuestions.includes(question)) {
        let i = this.state.myQuestions.indexOf(question);
        this.state.myQuestions.splice(i, 1);
      }
      this.setState({
        questionMap: questionMap,
        room: this.state.room
      });
    });

    onDisconnect(this.state.myQuestions, this.state.room);
  }

  ask(){
    let question = this.state.data;
    this.ask2(question)
    this.setState({data: ''});
  }

  ask2(question){
    if (!this.state.myQuestions.includes(question)) {
      askQuestion(question, this.state.room);
      //let newMyQ = this.state.myQuestions.map(d=>({...d}));
      //newMyQ.push(question);
      this.state.myQuestions.push(question);
      //this.setState({myQuestions: newMyQ});
    }
  }

  updateQuestionField(e) {
    this.setState({data: e.target.value});
  }

  removeAsk(question){
    stopAsking(question, this.state.room);
    //let newMyQ = this.state.myQuestions.map(d=>({...d}));
    //newMyQ = newMyQ.filter((q) => q !== question)
    //this.setState({myQuestions: newMyQ});
    let i = this.state.myQuestions.indexOf(question);
    this.state.myQuestions.splice(i, 1);
    // TODO: duplicate array?
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
      <div className="row longWord container-fluid">
        <div className="question col-xl-10 col-lg-10 col-md-10 col-sm-9 col-xs-12" key={question[0]}>
          <p className="col-8">{question[0]}</p>: <p class="col-3">{question[1]}</p>
        </div>
          {!this.state.myQuestions.includes(question[0])?
            <button className="btn btn-success col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12" onClick={()=>this.ask2(question[0])}>Ask</button>:
            <button className="btn btn-danger col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12" onClick={()=>this.removeAsk(question[0])}>Stop Asking</button>
          }
        </div>
    );


    return (
      <div>
        <Header value={"Student Page\nRoom: " + this.state.room}/>
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
          }}>hide FAQ &#9652;</p>
          <div id="faq_questions">
            <br/>
            <button className="btn btn-lg btn-danger" onClick={()=>this.ask2("I don't understand")}>
              I DON&#39;T UNDERSTAND
            </button>
            <button className="btn btn-lg btn-warning" onClick={()=>this.ask2("Could you give an example?")}>
              Could you give an example?
            </button>
            <button className="btn btn-lg btn-info" onClick={()=>this.ask2("Could you slow down?")}>
              Could you slow down?
            </button>
            <button className="btn btn-lg btn-success" onClick={()=>this.ask2("Could you speed up?")}>
              Could you speed up?
            </button>
          </div>
        </div>

        <div className="container-fluid">{questionList}</div>
        {/* <Questions value={this.state.questions} /> */}
        <Footer />
      </div>
    );
  }
}

export default Student;
