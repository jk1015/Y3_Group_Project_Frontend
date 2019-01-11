import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';

import { askQuestion,
  onClearAll,
  connectToRoom,
  onStudentQuestionAnswered,
  answerLecturerQuestion,
  stopAsking,
  onQuestionReceived,
  onDisconnect,
  onJoinError,
  onRelogin
} from './api';

const HashMap = require('hashmap');
const cookieHandler = require('./CookieHandler');

class Student extends Component {

  constructor(props) {
    super(props);
    const credentials = cookieHandler.getCookie("auth");

    this.state = {
       data: '',
       studentQuestionMap: new HashMap(),
       lecturerQuestionMap: new HashMap(),
       view: "main",
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
    this.answer = this.answer.bind(this);
    this.render_question = this.render_question.bind(this);
    this.removeAsk = this.removeAsk.bind(this);

    if(credentials !== undefined && credentials !== ''){
      connectToRoom(credentials, this.state.room, "student", questionMaps =>{

        let map = new HashMap();
        let map2 = new HashMap();
        map.copy(questionMaps.sqm);
        map2.copy(questionMaps.lqm);
        let keys = map.keys();
        for (var i = 0; i < keys.length; i++) {
          let key = keys[i];
          let val = map.get(key).count;
          map.set(key, val);
        }
        let keys2 = map2.keys();
        for (i = 0; i < keys2.length; i++) {
          let key = keys2[i];
          let val = {question: key, type: map2.get(key).type, options: map2.get(key).options};
          map2.set(key, val);
        }
        this.setState({
          studentQuestionMap: map,
          lecturerQuestionMap: map2,
          loading: false
        })
      });
    }

    onJoinError((error) => {
      this.setState({errorMessage: error, loading: false});
    });

    onQuestionReceived(received_question => {

      if (received_question.type === "student") {
        let map = this.state.studentQuestionMap;
        if( received_question.data == null || received_question.data.count <= 0) {
            map.delete(received_question.question);
          } else {
            map.set(received_question.question, received_question.data.count);
          }

          this.setState({
            studentQuestionMap: map
          });

          let myQuestions = this.state.myQuestions;
          if (received_question.user === this.state.login) {
            if (received_question.data == null || received_question.data.count <= 0) {
              myQuestions.delete(received_question.question)
            } else {
              myQuestions.set(received_question.question, received_question.question_id);
            }
          }

          this.setState({
            myQuestions: myQuestions
          })
        }
        else if(received_question.data !== null){
          let map = this.state.lecturerQuestionMap;
          map.set(received_question.question,
                  {question: received_question.question,
                   type: received_question.type,
                   options: received_question.options});
          this.setState({
            lecturerQuestionMap: map
          })
        }

    });

    onRelogin((user) => {
      this.setState({
        login: user.login,
        name: user.displayName,
      })
    })

    onClearAll(() => {
      this.setState({
        myQuestions: new HashMap(),
        studentQuestionMap: new HashMap(),
        lecturerQuestionMap: new HashMap()
      });
    });

    onStudentQuestionAnswered(question => {
      let studentQuestionMap = this.state.studentQuestionMap;
      let myQuestions = this.state.myQuestions;

      if (studentQuestionMap.has(question)) {
         studentQuestionMap.delete(question);
      }
      if (myQuestions.has(question)) {
         myQuestions.delete(question);
      }
      // if (this.state.myQuestions.includes(question)) {
      //   let i = this.state.myQuestions.indexOf(question);
      //   this.state.myQuestions.splice(i, 1);
      // }
      this.setState({
        studentQuestionMap: studentQuestionMap,
        room: this.state.room
      });
    });

    onDisconnect(this.state.myQuestions, this.state.room);
  }

  answer(question) {
    let answer = this.state.data;
    answerLecturerQuestion(question.question,
                          {answer: answer,
                           user: this.state.login},
                           this.state.room);
  }

  ask(){
    let question = this.state.data;
    this.ask2(question);
    this.setState({data: ''});
  }

  ask2(question){
    if(!this.state.myQuestions.has(question)){
    // if (!this.state.myQuestions.includes(question)) {
      askQuestion(question,
                  {question_type: "student",
                   user: {room: this.state.room,
                          login: this.state.login,
                          name: this.state.name,
                          type: "student"}
                   });
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

  render_question(question_text) {

    var question = this.state.lecturerQuestionMap.get(question_text);

    if(question.type === "text") {
      return(
        <div>
          <h2 id="faq_instruction" className="display-4 my-0">{question.question}</h2>
          <div class="row col-12">
          <input type="text" className="form-control my-0" placeholder="Answer here!" value={this.state.data} onChange={this.updateQuestionField}/>
          <div className="input-group-append my-0">
            <button className="btn btn-outline-dark px-4" type="button" onClick={() => {this.answer(question); this.setState({data:'', view:"main"})}}>Submit</button>
          </div>
          </div>
        </div>
        )
    }

    if(question.type === "multiple choice") {
      var optionList = question.options.map((option) =>
      <div class="row longWord" key={option}>
        <hr class=" w-100"/>
        <p class="col-8 text-left">{option}</p>
        <button class="btn badge-pill btn-outline-success col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12"
                onClick={()=>{this.setState({data:option}); this.answer(question); this.setState({data:'', view:"main"})}}>Submit</button>
      </div>
      );

      return(
        <div>
          <h2 id="faq_instruction" className="display-4 my-0">{question.question}</h2>
          {optionList}
        </div>
      );
    }
  }

  render() {
    var studentQuestions = [];

    this.state.studentQuestionMap.keys().forEach(
      function(key) {
        if(key !== "I don't understand!" &&
           key !== "Could you give an example?" &&
           key !== "Could you speed up?" &&
           key !== "Could you slow down?")
        {studentQuestions.push([key, this.state.studentQuestionMap.get(key)]);}
      }, this)

    studentQuestions.sort(
      function(a, b) {
        return b[1] - a[1];
      }
    )

    var studentQuestionList = studentQuestions.map((question) =>
    <div class="row longWord" key={question[0]}>
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

    var lecturerQuestions = this.state.lecturerQuestionMap.keys();

    var lecturerQuestionList = lecturerQuestions.map((question_text) =>
    <div class="row">
      <hr class=" w-100"/>
      <p class="col-8 text-left">{question_text}</p>
          <button class="btn badge-pill btn-outline-success col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12"
          onClick={() => this.setState({view: question_text})}>Answer</button>
      </div>
    );

    let mainView;

    if(this.state.credentials && this.state.credentials !== ""
      && !this.state.loading && !this.state.errorMessage){

      mainView = <div>

      <div>
      {lecturerQuestionList}
      </div>
        <div id="input_bar" className="input-group">
          <input type="text" className="form-control my-0" placeholder="Ask your question here" value={this.state.data} onChange={this.updateQuestionField}/>
          <div className="input-group-append my-0">
            <button className="btn btn-outline-dark px-4" type="button" onClick={this.ask}>Ask!</button>
          </div>
        </div>
        <div id="faq_questions" className="row col-12">
          <button className="btn btn-lg btn-outline-danger col-12 col-sm-6 m-0" onClick={()=>this.ask2("I don't understand!")}>
            I don&#39;t understand!
          </button>
          <button className="btn btn-lg btn-outline-warning col-12 col-sm-6 m-0" onClick={()=>this.ask2("Could you give an example?")}>
            Could you give an example?
          </button>
          <button className="btn btn-lg btn-outline-primary col-12 col-sm-6 m-0" onClick={()=>this.ask2("Could you slow down?")}>
            Could you slow down?
          </button>
          <button className="btn btn-lg btn-outline-success col-12 col-sm-6 m-0" onClick={()=>this.ask2("Could you speed up?")}>
            Could you speed up?
          </button>
        </div>

        <div className="container-fluid my-0 col-10" style={{display:"block"}}>{studentQuestionList}</div>
        {/* <Questions value={this.state.questions} /> */}
        <div>
          <button onClick={() => this.logout()}>Logout</button>
        </div>
        <h6 id="logging_header" className="my-0">{"Logged in as: " + this.state.name}</h6>
      </div>
    }

    if(this.state.view !== "main") {
      return(this.render_question(this.state.view));
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
