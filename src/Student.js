import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';

import { askQuestion,
  onClearAll,
  connectToRoom,
  onQuestionAnswered,
  stopAsking,
  onQuestionReceived,
  onDisconnect,
  Header,
  Footer,
  onJoinError,
  onRelogin
} from './api';

//var student_page = require('./student.html.js');
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();
const HashMap = require('hashmap');
const cookieHandler = require('./CookieHandler');

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
    const credentials = cookieHandler.getCookie("auth");

    this.state = {
       data: '',
       questionMap: new HashMap(),
       myQuestions: new HashMap(), //[], // [{'quesion', id}]
       room: props.room,
       login: undefined,
       name: undefined,
       credentials: credentials,
       errorMessage: undefined,
       loading: (credentials !== undefined && credentials !== '') ? true : false
    }

    this.updateQuestionField = this.updateQuestionField.bind(this);
    this.ask = this.ask.bind(this);
    this.removeAsk = this.removeAsk.bind(this);

    if(credentials !== undefined && credentials !== ''){
      connectToRoom(credentials, this.state.room, "student", questionMap =>{

        let map = new HashMap();
        let map2 = new HashMap();
        map.copy(questionMap)
        let keys = map.keys();
        for (var i = 0; i < keys.length; i++) {
          let key = keys[i];
          let val = map.get(key).count;
          map2.set(key, val);
        }
        this.setState({
          questionMap: map2,
          loading: false
        })
      });
    }

    onJoinError((error) => {
      this.setState({errorMessage: error, loading: false});
    });

    onQuestionReceived(questionTally => {
      let map = this.state.questionMap;
      if(questionTally.data == null || questionTally.data.count <= 0) {
          map.delete(questionTally.question);
      } else {
          map.set(questionTally.question, questionTally.data.count);
      }

      this.setState({
          questionMap: map
      });

      let myQuestions = this.state.myQuestions;
      if (questionTally.user === props.value[1]) {
        if (questionTally.data == null || questionTally.data.count <= 0) {
            myQuestions.delete(questionTally.question)
        } else {
            myQuestions.set(questionTally.question, questionTally.question_id.id);
        }
      }

      this.setState({
          myQuestions: myQuestions
      })
    });

    onRelogin((user) => {
      this.setState({
        login: user.login,
        name: user.displayName,
      })
    })

    onClearAll(() => {
      this.setState({
        questionMap: new HashMap()
      });
    });

    onQuestionAnswered(question => {
      let questionMap = this.state.questionMap;
      let myQuestions = this.state.myQuestions;

      if (questionMap.has(question)) {
         questionMap.delete(question);
      }
      if (myQuestions.has(question)) {
         myQuestions.delete(question);
      }
      // if (this.state.myQuestions.includes(question)) {
      //   let i = this.state.myQuestions.indexOf(question);
      //   this.state.myQuestions.splice(i, 1);
      // }
      this.setState({
        questionMap: questionMap,
        room: this.state.room
      });
    });

    onDisconnect(this.state.myQuestions, this.state.room);
  }

  ask(){
    let question = this.state.data;
    this.ask2(question);
    this.setState({data: ''});
  }

  ask2(question){
    if(!this.state.myQuestions.has(question)){
    // if (!this.state.myQuestions.includes(question)) {
      askQuestion(question, {room: this.state.room,
        login: this.state.login,
        name: this.state.name});

      let temp = this.state.myQuestions;
      temp.set(question, '');
      this.setState({myQuestions: temp});
    }
  }

  updateQuestionField(e) {
    this.setState({data: e.target.value});
  }

  removeAsk(question){
    stopAsking(question, {
      room: this.state.room,
      login: this.state.login,
      name: this.state.name,
      question_id: this.state.myQuestions.get(question)}
    );
    //let newMyQ = this.state.myQuestions.map(d=>({...d}));
    //newMyQ = newMyQ.filter((q) => q !== question)
    //this.setState({myQuestions: newMyQ});

    // let i = this.state.myQuestions.indexOf(question);
    // this.state.myQuestions.splice(i, 1);

    if(this.state.myQuestions.has(question)){
      this.state.myQuestions.delete(question)
    }
    // TODO: duplicate array?
  }

  logout(){
    cookieHandler.setCookie('auth', '');
    window.location.href = '/';
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
    <div class="row longWord" key={question}>
      <hr class=" w-100"/>
      <div class="col-md-10 col-sm-9 col-xs-12 row text-right" key={question[0]}>
        <p class="col-8 text-left">{question[0]}</p>: <p class="col-3">{question[1]}</p>
      </div>
        {!this.state.myQuestions.has(question[0])?
          <button class="btn badge-pill btn-outline-success col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12" onClick={()=>this.ask2(question[0])}>Vote</button>:
          <button class="btn badge-pill btn-outline-danger col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12" onClick={()=>this.removeAsk(question[0])}>Undo vote</button>
        }
      </div>
    );

    let mainView;

    if(this.state.credentials && this.state.credentials !== ""
      && !this.state.loading && !this.state.errorMessage){

      mainView = <div>
        <div>
          <button onClick={() => this.logout()}>Logout</button>
        </div>
        <h6 id="logging_header">{"Logged in as: " + this.state.name}</h6>
        <a id="faq_button" className="hide_button" href="#" onClick={()=>{
          let faq_questions = document.getElementById("faq_instruction");
          let faq_button = document.getElementById("faq_button");
          if (faq_questions.style.display === "none") {
            faq_questions.style.display = "block";
            faq_button.innerHTML = "hide &#9652;";
          } else {
            faq_questions.style.display = "none";
            faq_button.innerHTML = "show  &#9662;";
          }
        }}>hide &#9652;</a>
        <h2 id="faq_instruction" className="display-4 my-5">How do you feel about the lecture?</h2>
        <div id="faq_questions" className="row">
          <br/>
          <button className="btn badge-pill btn-lg btn-outline-danger col-10 col-md-5 m-3" onClick={()=>this.ask2("I don't understand!")}>
            I don&#39;t understand!
          </button>
          <button className="btn badge-pill btn-lg btn-outline-warning col-10 col-md-5 m-3" onClick={()=>this.ask2("Could you give an example?")}>
            Could you give an example?
          </button>
          <button className="btn badge-pill btn-lg btn-outline-primary col-10 col-md-5 m-3" onClick={()=>this.ask2("Could you slow down?")}>
            Could you slow down?
          </button>
          <button className="btn badge-pill btn-lg btn-outline-success col-10 col-md-5 m-3" onClick={()=>this.ask2("Could you speed up?")}>
            Could you speed up?
          </button>
        </div>
        <hr className="mt-5 mb-0"/>
        <a id="question_button" className="text-primary hide_button" href="#" onClick={()=>{
          let faq_questions = document.getElementById("question_instruction");
          let faq_button = document.getElementById("question_button");
          if (faq_questions.style.display === "none") {
            faq_questions.style.display = "block";
            faq_button.innerHTML = "hide &#9652;";
          } else {
            faq_questions.style.display = "none";
            faq_button.innerHTML = "show &#9662;";
          }
        }}>hide &#9652;</a>
        <h2 id="question_instruction" className="display-4 my-5">Ask a question of your own!</h2>
        <div className="input-group container-fluid col-9 mt-5">
          <input type="text" className="form-control my-4" placeholder="Ask your question here" value={this.state.data} onChange={this.updateQuestionField}/>
          <div className="input-group-append my-4">
            <button className="btn btn-outline-dark px-4" type="button" onClick={this.ask}>Ask!</button>
          </div>
        </div>
        <br/>
        <hr className="mt-5 mb-0"/>
        <a id="vote_button" className="text-primary hide_button" href="#" onClick={()=>{
          let faq_questions = document.getElementById("vote_instruction");
          let faq_button = document.getElementById("vote_button");
          if (faq_questions.style.display === "none") {
            faq_questions.style.display = "block";
            faq_button.innerHTML = "hide &#9652;";
          } else {
            faq_questions.style.display = "none";
            faq_button.innerHTML = "show &#9662;";
          }
        }}>hide &#9652;</a>
        <h2 id="vote_instruction" className="display-4 my-5">Or you can vote on questions!</h2>
        <div className="container-fluid my-5 col-10" style={{display:"block"}}>{questionList}</div>
        {/* <Questions value={this.state.questions} /> */}
      </div>
    }

    return (
      <div>
        <h1>{"Room " + this.state.room}</h1>

        {mainView}
        {this.state.errorMessage ?
          <div>
            <p>{this.state.errorMessage}</p>
            <a href="/">
              <button>Back</button>
            </a>
          </div>
          : undefined
        }

        {(this.state.credentials === undefined || this.state.credentials === '')?
          <div>
            <p>You have to login first</p>
            <a href="/">
              <button>Login</button>
            </a>
          </div>
          : undefined
        }

        <ClipLoader
           // className={override}
           sizeUnit={"px"}
           size={50}
           color={'#0336FF'}
           loading={this.state.loading}
         />

      </div>
    );
  }
}

export default Student;
