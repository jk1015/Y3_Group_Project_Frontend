import React, {} from 'react';
import { Bar } from 'react-chartjs-2';
import { ClipLoader } from 'react-spinners';

import {
    onClearAll,
    clearAll,
    askQuestion,
    connectToRoom,
    onQuestionReceived,
    answerStudentQuestion,
    onStudentQuestionAnswered,
    onLecturerQuestionAnswered,
    onJoinError,
    onRelogin
} from './api';

const HashMap = require('hashmap');
const cookieHandler = require('./CookieHandler');

class Lecturer extends React.Component {

  constructor(props) {
    super(props);
    const credentials = cookieHandler.getCookie("auth");

    this.state ={
        studentQuestionMap: new HashMap(),
        lecturerQuestionMap: new HashMap(),
        question_to_render: false,
        view: "main",
        setQuestionTextField: '',
        option_set: [],
        room: props.room,
        login: undefined,
        name: undefined,
        credentials: credentials,
        errorMessage: undefined,
        loading: (credentials !== undefined && credentials !== '') ? true : false,

        data: {
            labels: ["I don't understand!", "Could you give an example?", "Could you slow down?", "Could you speed up?"],
            datasets: [{
                label: '',
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(255, 206, 86, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(75, 192, 192, 0.4)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }],
            xAxes: [{
              ticks:{
                display: false
              }
            }]
          },
          legend:{
            display:false
          }
        }
    }

    this.updateSetQuestionTextField = this.updateSetQuestionTextField.bind(this);
    this.ask = this.ask.bind(this);

    if(credentials !== undefined && credentials !== ''){
      connectToRoom(credentials, this.state.room, "lecturer", questionMaps =>{
        let map = new HashMap();
        let map2 = new HashMap();
        map.copy(questionMaps.sqm);
        map2.copy(questionMaps.lqm);
        let dataNew = this.state.data;
        dataNew.datasets[0].data = [
          map.get("I don't understand!") ? map.get("I don't understand!").count : null,
          map.get("Could you give an example?") ? map.get("Could you give an example?").count : null,
          map.get("Could you slow down?") ? map.get("Could you slow down?").count : null,
          map.get("Could you speed up?") ? map.get("Could you speed up?").count : null];
        this.setState({
            studentQuestionMap: map,
            lecturerQuestionMap:map2,
            room: this.state.room,
            data: dataNew,
            options: this.state.options,
            loading: false
        })
      });
    }

    onJoinError((error) => {
      this.setState({errorMessage: error, loading: false});
    });

    onRelogin((user) => {
      this.setState({
        login: user.login,
        name: user.displayName,
      })
    })

    onQuestionReceived(received_question => {
        if(received_question.type === "student") {
          let map = this.state.studentQuestionMap;

          if(received_question.data == null || received_question.data.count <= 0)
            map.delete(received_question.question)
          else
            map.set(received_question.question, received_question.data);
            let dataNew = this.state.data;
            dataNew.datasets[0].data=[
              map.get("I don't understand!") ? map.get("I don't understand!").count : null,
              map.get("Could you give an example?") ? map.get("Could you give an example?").count : null,
              map.get("Could you slow down?") ? map.get("Could you slow down?").count : null,
              map.get("Could you speed up?") ? map.get("Could you speed up?").count : null];
          this.setState({
              studentQuestionMap: map,
              room: this.state.room,
              data: dataNew,
              options: this.state.options
          })
        }
        else if(received_question.data !== null){
          let map = this.state.lecturerQuestionMap;
          map.set(received_question.question, received_question.data);
          this.setState({lecturerQuestionMap: map})
        }
        else {
          let map = this.state.studentQuestionMap;
          map.delete(received_question.question);
          this.setState({
            studentQuestionMap: map
          })
        }
    });

    onStudentQuestionAnswered(question => {
        let map = this.state.studentQuestionMap;
        map.delete(question);
        let dataNew = this.state.data;
        dataNew.datasets[0].data=[
          map.get("I don't understand!") ? map.get("I don't understand!").count : null,
          map.get("Could you give an example?") ? map.get("Could you give an example?").count : null,
          map.get("Could you slow down?") ? map.get("Could you slow down?").count : null,
          map.get("Could you speed up?") ? map.get("Could you speed up?").count : null];
        this.setState({
            studentQuestionMap: map,
            room: this.state.room,
            data: dataNew,
            options: this.state.options
        })
    });

    onLecturerQuestionAnswered((answer) => {
      let map = this.state.lecturerQuestionMap;
      map.get(answer.question).answers.push(answer.answer);
      map.get(answer.question).count++;
      this.setState({
        lecturerQuestionMap: map
      });
    })

    onClearAll(() => {
        let map = new HashMap();
        let map2 = new HashMap();
        let dataNew=this.state.data;
        dataNew.datasets[0].data=[
          map.get("I don't understand!") ? map.get("I don't understand!").count : null,
          map.get("Could you give an example?") ? map.get("Could you give an example?").count : null,
          map.get("Could you slow down?") ? map.get("Could you slow down?").count : null,
          map.get("Could you speed up?") ? map.get("Could you speed up?").count : null];
        this.setState({
        studentQuestionMap: map,
        lecturerQuestionMap: map2,
        room: this.state.room,
        data: dataNew,
        options: this.state.options
        });
    });
  }


  updateSetQuestionTextField(e) {
    this.setState({setQuestionTextField: e.target.value});
  }

  updateOptionSetTextField(n, e) {
    let arr = this.state.option_set.slice(0);
    arr[n] = e.target.value;
    this.setState({option_set: arr});
    this.forceUpdate();
  }

  ask(question_type){
    let question = this.state.setQuestionTextField;
    let options = this.state.option_set.slice();

    askQuestion(question,
                {question_type: question_type,
                 options: options,
                 user: {room: this.state.room,
                        login: this.state.login,
                        name: this.state.name,
                        type: "lecturer"}
                 });

    this.setState({setQuestionTextField: '',
                   option_set: []});
  }

  componentDidMount(){

    fetch('http://localhost:8080/data/' + this.state.room, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        start_time:0,
        end_time:1546976183610
      })
    })
    .then(res =>{
      return res.json();
    })
    .then(data =>{
      //console.log(data);
    })
    .catch((err) => {
      //Error
    })

  }

  logout(){
    cookieHandler.setCookie('auth', '');
    window.location.href = '/';

  }

  render_question(question_text) {

    let question = this.state.lecturerQuestionMap.get(question_text)
    if(question.type === "text") {
      let answerList = question.answers.map((user_answer) =>
        <div className="row">
          <p className="col-8 text-left">{user_answer.answer}</p>
          <p className="col-4 text-right">{user_answer.user}</p>
          <hr className=" w-100"/>
        </div>
      );
      return (
        <div>
        <button className="btn btn-outline-dark" onClick={()=>this.setState({view: "viewingAnswers"})}>Back</button>
        {answerList}
        </div>
      );
    }
    else if(question.type === "multiple choice") {

      let counts = [];
      for (let i = 0; i < question.options.length; i++) {
        counts.push(0);
      }
      question.answers.forEach((user_answer) => {
        for (let i = 0; i < counts.length; i++) {
          if (user_answer.answer === question.options[i]) {
            counts[i]++;
          }
        }
      });

      let results = {labels: question.options,
                  datasets: [{
                    label:'',
                    data: counts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.4)',
                        'rgba(255, 206, 86, 0.4)',
                        'rgba(54, 162, 235, 0.4)',
                        'rgba(75, 192, 192, 0.4)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1
                  }]}
        let options = {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }],
            xAxes: [{
              ticks:{
                display: true
              }
            }]
          },
          legend:{
            display:true
          }
        }
      return (
        <div className="container my-3">
          <button className="btn btn-outline-dark" onClick={()=>this.setState({view: "viewingAnswers"})}>Back</button>
          <Bar
            data={results}
            options={options}
          />
        </div>
      );
    }
  }

  render() {
    let option_set_list = [];

    for (let i = 0; i < this.state.option_set.length; i++) {
      let j = i;
      option_set_list.push(
        <div className="row longWord">
        <input type="text" className="form-control my-4"
                           value={this.state.option_set[i]} placeholder={"Option " + (i + 1)}
                           onChange={(e) => this.updateOptionSetTextField(j, e)}/>
          {(this.state.option_set.length === i+1) ?
          <div className = "input-group-append my-4">
          <button className="btn btn-outline-dark px-4" type="button" onClick={() => {this.state.option_set.push(""); this.forceUpdate()}}>Add another option</button>
          <button className="btn btn-outline-dark px-4" type="button" onClick={() => {this.ask("multiple choice")}}>Done!</button>
          </div>:
          undefined}

        </div>);
    }

    let setView =
      <div>
        <h1>{this.state.room + " Question Setting Page"}</h1>
        <div id="Change view">
        <button className="btn btn-outline-dark" onClick={()=>this.setState({view: "main"})}>View student feedback</button>
        <button className="btn btn-outline-dark" onClick={()=>this.setState({view: "viewingAnswers"})}>View student answers</button>
        </div>
        <div className="input-group container-fluid col-9 mt-5">
          <input type="text" className="form-control my-4" placeholder="Ask your question here" value={this.state.setQuestionTextField} onChange={this.updateSetQuestionTextField}/>
          <div className="input-group-append my-4">
            <button className="btn btn-outline-dark px-4" type="button" onClick={() => {this.state.option_set.push(""); this.forceUpdate()}}>Multiple Choice</button>
            <button className="btn btn-outline-dark px-4" type="button" onClick={()=> {this.ask("text")}}>Text answer</button>
          </div>
        </div>
        <div>{option_set_list}</div>
      </div>

      let lecturerQuestions = this.state.lecturerQuestionMap.keys();

      let lecturerQuestionList = lecturerQuestions.map((question_text) =>
      <div className="row">
        <hr className=" w-100"/>
        <p className="col-8 text-left">{question_text}</p>
            <button className="btn badge-pill btn-outline-success col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12"
            onClick={() => this.setState({view: question_text})}>View answers</button>
        </div>
      );

    let answerView =
      <div>
        <div id="Change view">
          <button className="btn btn-outline-dark" onClick={()=>this.setState({view: "main"})}>View student feedback</button>
          <button className="btn btn-outline-dark" onClick={()=>this.setState({view: "settingQuestions"})}>Set questions for students</button>
        </div>
        {lecturerQuestionList}
      </div>

    let studentQuestions = [];
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
        return b[1].count - a[1].count;
      }
    )

/*
    function generate_mail_link(question) {
      let mail_link = "mailto:";
      question[1].users.forEach(user => {
        mail_link = mail_link + user.login + "@ic.ac.uk, ";
      });
      return mail_link
    } */

    let studentQuestionList = studentQuestions.map((question) =>
    <div key={question[0]} className="row longWord">
      <hr className=" w-100"/>
      <div className="col-md-10 col-sm-9 col-xs-12 row text-right" key={question[0]}>
        <p className="col-8 text-left">{question[0]}</p>: <p className="col-3">{question[1].count}</p>
        <p>{"Asked by: " + question[1].users.map(user => {
          return user.name;
        })}</p>
      </div>
        <div className = "input-group-append my-4">
        <button className="btn btn-outline-warning" onClick={()=>answerStudentQuestion(question[0], "Answered in lecture", this.state.room)}>Answered</button>
        <button className="btn btn-outline-warning" onClick={()=>{answerStudentQuestion(question[0], "Answered by email", this.state.room)}}>Answer askers via email</button>
        <button className="btn btn-outline-warning" onClick={()=>{answerStudentQuestion(question[0], "Answered by class", this.state.room);
                                                              this.setState({setQuestionTextField : question[0]});
                                                              this.ask("text")}}>Send question to class</button>
        </div>
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

        {/* <p className="DontUnderstandText">Number of students who don't understand: {this.state.questionMap.get("I don't understand")}</p>

        <p className="DontUnderstandText">Number of students who don&#39;t understand: {this.state.questionMap.get("I don't understand")}</p>
        <p className="ExampleText">Number of students who want an example: {this.state.questionMap.get("Could you give an example?")}</p>
        <p className="SlowDownText">Number of students who ask for slowing down: {this.state.questionMap.get("Could you slow down?")}</p>
        <p className="SpeedUpText">Number of students who ask for speeding up: {this.state.questionMap.get("Could you speed up?")}</p> */}

        <div className="container my-3">
          <Bar
            data={this.state.data}
            options={this.state.options}
          />
        </div>
        <div id="Change view">
        <button className="btn btn-outline-dark" onClick={()=>this.setState({view: "settingQuestions"})}>Set questions for students</button>
        <button className="btn btn-outline-dark" onClick={()=>this.setState({view: "viewingAnswers"})}>View student answers</button>
        </div>

        <hr className="mt-5 mb-0"/>
        <div className="container-fluid my-5 col-10" style={{display:"block"}}>{studentQuestionList}</div>
        <div id="Clear">
          <button className="btn btn-outline-dark" style={{margin:'50px'}} onClick={()=>clearAll(this.state.room)}>CLEAR ALL!</button>
        </div>

      </div>
    }

    if(this.state.view === "settingQuestions") {
      return (
        <div>
          {setView}
        </div>
      )
    }
    else if(this.state.view === "viewingAnswers") {
      return (
        <div>
          {answerView}
        </div>
      )
    }
    else if(this.state.view !== "main") {
      return(this.render_question(this.state.view));
    }
    return (
      <div>
        <h1>{this.state.room}</h1>

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

export default Lecturer;
