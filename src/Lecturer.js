import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { ClipLoader } from 'react-spinners';

import {
    onClearAll,
    clearAll,
<<<<<<< HEAD
    askQuestion,
    connectLecturer,
=======
    connectToRoom,
>>>>>>> master
    onQuestionReceived,
    onQuestionAnswered,
    answerQuestion,
    joinRoom,
    Header,
    Footer,
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
        questionMap: new HashMap(),
<<<<<<< HEAD
        room: this.props.value[2],
        login: this.props.value[1],
        name: this.props.value[0],
        settingQuestions: false,
        setQuestionTextField: '',
=======
        room: props.room,
        login: undefined,
        name: undefined,
        credentials: credentials,
        errorMessage: undefined,
        loading: (credentials !== undefined && credentials !== '') ? true : false,
>>>>>>> master

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
      connectToRoom(credentials, this.state.room, "lecturer", questionMap =>{
        let map = new HashMap();
        map.copy(questionMap);
        var dataNew=this.state.data;
        dataNew.datasets[0].data=[
          map.get("I don't understand!") ? map.get("I don't understand!").count : null,
          map.get("Could you give an example?") ? map.get("Could you give an example?").count : null,
          map.get("Could you slow down?") ? map.get("Could you slow down?").count : null,
          map.get("Could you speed up?") ? map.get("Could you speed up?").count : null];
        this.setState({
            questionMap: map,
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

    onQuestionReceived(questionTally => {
        let map = this.state.questionMap;

        if(questionTally.data == null || questionTally.data.count <= 0)
          map.delete(questionTally.question)
        else
          map.set(questionTally.question, questionTally.data);
          var dataNew=this.state.data;
          dataNew.datasets[0].data=[
            map.get("I don't understand!") ? map.get("I don't understand!").count : null,
            map.get("Could you give an example?") ? map.get("Could you give an example?").count : null,
            map.get("Could you slow down?") ? map.get("Could you slow down?").count : null,
            map.get("Could you speed up?") ? map.get("Could you speed up?").count : null];
        this.setState({
            questionMap: map,
            room: this.state.room,
            data: dataNew,
            options: this.state.options
        })
    });

    onQuestionAnswered(question => {
        let map = this.state.questionMap;
        map.delete(question);
        var dataNew=this.state.data;
        dataNew.datasets[0].data=[
          map.get("I don't understand!") ? map.get("I don't understand!").count : null,
          map.get("Could you give an example?") ? map.get("Could you give an example?").count : null,
          map.get("Could you slow down?") ? map.get("Could you slow down?").count : null,
          map.get("Could you speed up?") ? map.get("Could you speed up?").count : null];
        this.setState({
            questionMap: map,
            room: this.state.room,
            data: dataNew,
            options: this.state.options
        })
    });

    onClearAll(() => {
        let map = new HashMap();
        var dataNew=this.state.data;
        dataNew.datasets[0].data=[
          map.get("I don't understand!") ? map.get("I don't understand!").count : null,
          map.get("Could you give an example?") ? map.get("Could you give an example?").count : null,
          map.get("Could you slow down?") ? map.get("Could you slow down?").count : null,
          map.get("Could you speed up?") ? map.get("Could you speed up?").count : null];
        this.setState({
        questionMap: map,
        room: this.state.room,
        data: dataNew,
        options: this.state.options
        });
    });
  }


  updateSetQuestionTextField(e) {
    this.setState({setQuestionTextField: e.target.value});
  }

  ask(){
    let question = this.state.setQuestionTextField;
    askQuestion(question, {room: this.state.room,
      login: this.state.login,
      name: this.state.name});

    this.setState({setQuestionTextField: ''});
  }

  componentDidMount(){

    fetch('http://localhost:8080/data/' + this.state.room, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //date?
      })
    })
    .then(res =>{
      return res.json();
    })
    .then(data =>{
      console.log(data);
    })
    .catch((err) => {
      //Error
    })

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
    <div class="row longWord">
      <hr class=" w-100"/>
      <div class="col-md-10 col-sm-9 col-xs-12 row text-right" key={question[0]}>
        <p class="col-8 text-left">{question[0]}</p>: <p class="col-3">{question[1].count}</p>
        <p>{"Asked by: " + question[1].users.map(user => {
          return user.name;
        })}</p>
      </div>
      <button class="btn btn-outline-warning col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12" onClick={()=>answerQuestion(question[0], this.state.room)}>Answer</button>
    </div>
    );

    if(this.state.settingQuestions) {
      return (
        <div>
          <h1>{"Room " + this.state.room + " Question Setting Page"}</h1>
          <div id="Change page">
            <button className="btn btn-outline-dark" style={{margin:'50px'}} onClick={()=>this.setState({settingQuestions: false})}>View student feedback</button>
          </div>
          <div class="input-group container-fluid col-9 mt-5">
            <input type="text" class="form-control my-4" placeholder="Ask your question here" value={this.state.setQuestionTextField} onChange={this.updateSetQuestionTextField}/>
            <div class="input-group-append my-4">
              <button class="btn btn-outline-dark px-4" type="button" onClick={this.ask}>Ask!</button>
            </div>
          </div>
        </div>

      )
    }

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

        <a id="chart_button" className="hide_button" href="#" onClick={()=>{
          let faq_questions = document.getElementById("chart_instruction");
          let faq_button = document.getElementById("chart_button");
          if (faq_questions.style.display === "none") {
            faq_questions.style.display = "block";
            faq_button.innerHTML = "hide &#9652;";
          } else {
            faq_questions.style.display = "none";
            faq_button.innerHTML = "show  &#9662;";
          }
        }}>hide &#9652;</a>
        <h2 id="chart_instruction" className="display-4 my-5">Students now feel...</h2>
        <div className="container my-3">
          <Bar
            data={this.state.data}
            options={this.state.options}
          />
        </div>
        <hr className="mt-5 mb-0"/>
        <a id="studentQuestions_button" className="hide_button" href="#" onClick={()=>{
          let faq_questions = document.getElementById("studentQuestions_instruction");
          let faq_button = document.getElementById("studentQuestions_button");
          if (faq_questions.style.display === "none") {
            faq_questions.style.display = "block";
            faq_button.innerHTML = "hide &#9652;";
          } else {
            faq_questions.style.display = "none";
            faq_button.innerHTML = "show  &#9662;";
          }
        }}>hide &#9652;</a>
        <h2 id="studentQuestions_instruction" className="display-4 my-5">Questions asked by students are here!</h2>
        <div className="container-fluid my-5 col-10" style={{display:"block"}}>{questionList}</div>
        <div id="Clear">
          <button className="btn btn-outline-dark" style={{margin:'50px'}} onClick={()=>clearAll(this.state.room)}>CLEAR ALL!</button>
        </div>

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

export default Lecturer;
