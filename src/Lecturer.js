import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

import {
    onClearAll,
    clearAll,
    connectLecturer,
    onQuestionReceived,
    onQuestionAnswered,
    answerQuestion,
    joinRoom,
    Header,
    Footer
} from './api';

const HashMap = require('hashmap');

class Lecturer extends React.Component {

  constructor(props) {
    super(props);

    this.state ={
        questionMap: new HashMap(),
        settingQuestions: false,
        room: this.props.value[2],
        login: this.props.value[1],
        name: this.props.value[0],
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

    connectLecturer(this.state.room, questionMap =>{
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
          options: this.state.options
      })
    });

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
            <input type="text" class="form-control my-4" placeholder="Ask your question here" value={null} onChange={null}/>
            <div class="input-group-append my-4">
              <button class="btn btn-outline-dark px-4" type="button" onClick={null}>Ask!</button>
            </div>
          </div>
        </div>

      )
    }
    return (
       <div>
         <h1>{"Room " + this.state.room + " Student Feedback Page"}</h1>
         <div id="Change page">
           <button className="btn btn-outline-dark" style={{margin:'50px'}} onClick={()=>this.setState({settingQuestions:true})}>Send questions to students</button>
         </div>
         <h6 id="logging_header">{"Logged in as: " + this.state.name}</h6>
         {/* <p className="DontUnderstandText">Number of students who don't understand: {this.state.questionMap.get("I don't understand")}</p>

         <p className="DontUnderstandText">Number of students who don&#39;t understand: {this.state.questionMap.get("I don't understand")}</p>
         <p className="ExampleText">Number of students who want an example: {this.state.questionMap.get("Could you give an example?")}</p>
         <p className="SlowDownText">Number of students who ask for slowing down: {this.state.questionMap.get("Could you slow down?")}</p>
         <p className="SpeedUpText">Number of students who ask for speeding up: {this.state.questionMap.get("Could you speed up?")}</p> */}

           <a id="chart_button" class="hide_button" href="#" onClick={()=>{
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
           <h2 id="chart_instruction" class="display-4 my-5">Students now feel...</h2>
           <div class="container my-3">
             <Bar
               data={this.state.data}
               options={this.state.options}
             />
           </div>
           <hr class="mt-5 mb-0"/>
           <a id="studentQuestions_button" class="hide_button" href="#" onClick={()=>{
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
           <h2 id="studentQuestions_instruction" class="display-4 my-5">Questions asked by students are here!</h2>
           <div class="container-fluid my-5 col-10" style={{display:"block"}}>{questionList}</div>
           <div id="Clear">
             <button className="btn btn-outline-dark" style={{margin:'50px'}} onClick={()=>clearAll(this.state.room)}>CLEAR ALL!</button>
           </div>
         </div>
    );
  }
}

export default Lecturer;
