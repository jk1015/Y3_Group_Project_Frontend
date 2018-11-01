import React, { Component } from 'react';

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

class Lecturer extends Component {

  constructor(props) {
    super(props);

    this.state ={
        questionMap: new HashMap(),
        room: props.value
    }

    connectLecturer(this.state.room, questionMap =>{
      let map = new HashMap();
      map.copy(questionMap)
      this.setState({
          questionMap: map,
          room: this.state.room
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

    onQuestionAnswered(question => {
        let map = this.state.questionMap;
        map.delete(question);
        this.setState({
            questionMap: map,
            room: this.state.room
        })
    });

    onClearAll(() => {
        let map = new HashMap();
        this.setState({
        questionMap: map,
        room: this.state.room
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
    <div class="row longWord container-fluid">
      <div class="question col-xl-11 col-lg-10 col-md-10 col-sm-9 col-xs-12" key={question[0]}>
        <p class="col-8">{question[0]}</p>: <p class="col-3">{question[1]}</p>
      </div>
      <button class="btn btn-warning col-xl-1 col-lg-2 col-md-2 col-sm-3 col-xs-12" onClick={()=>answerQuestion(question[0], this.state.room)}>Answer</button>
      </div>
    );
    return (
       <div>
         <Header value={"Lecturer\nRoom: " + this.state.room}/>
         <p>Lecturer</p>
           <tr></tr>
         {/* <p className="DontUnderstandText">Number of students who don't understand: {this.state.questionMap.get("I don't understand")}</p>

         <p className="DontUnderstandText">Number of students who don&#39;t understand: {this.state.questionMap.get("I don't understand")}</p>
         <p className="ExampleText">Number of students who want an example: {this.state.questionMap.get("Could you give an example?")}</p>
         <p className="SlowDownText">Number of students who ask for slowing down: {this.state.questionMap.get("Could you slow down?")}</p>
         <p className="SpeedUpText">Number of students who ask for speeding up: {this.state.questionMap.get("Could you speed up?")}</p> */}
         <div class="container-fluid">{questionList}</div>

         <div id="Clear">
           <button className="button_info " onClick={()=>clearAll(this.state.room)}>CLEAR ALL!</button>
         </div>
         <Footer />
       </div>
    );
  }
}

export default Lecturer;
