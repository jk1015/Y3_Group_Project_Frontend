import React, { Component } from 'react';

import {
    onClearAll,
    clearAll,
    connectLecturer,
    onQuestionReceived,
    onQuestionAnswered,
    answerQuestion,
    joinRoom,
    Header
} from './api';

const HashMap = require('hashmap');

class Lecturer extends Component {

  constructor(props) {
    super(props);

    this.state ={
        questionMap: new HashMap()
    }

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

    onQuestionAnswered(question => {
        let map = this.state.questionMap;
        map.delete(question);
        this.setState({
            questionMap: map
        })
    });

    onClearAll(() => {
        let map = new HashMap();
        this.setState({
        questionMap: map
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
      <div class="question" key={question[0]}>
        <p>{question[0]}</p>: <p>{question[1]}</p>
        <button class="button_info" onClick={()=>answerQuestion(question[0])}>Answer</button>
      </div>
    );
    return (
       <div>
         <Header value="Lecturer"/>
         <p>Lecturer</p>
           <tr></tr>
         {/* <p className="DontUnderstandText">Number of students who don't understand: {this.state.questionMap.get("I don't understand")}</p>

         <p className="DontUnderstandText">Number of students who don&#39;t understand: {this.state.questionMap.get("I don't understand")}</p>
         <p className="ExampleText">Number of students who want an example: {this.state.questionMap.get("Could you give an example?")}</p>
         <p className="SlowDownText">Number of students who ask for slowing down: {this.state.questionMap.get("Could you slow down?")}</p>
         <p className="SpeedUpText">Number of students who ask for speeding up: {this.state.questionMap.get("Could you speed up?")}</p> */}
         <div>{questionList}</div>

         <div id="Clear">
           <button className="button_info" onClick={()=>clearAll()}>CLEAR ALL!</button>
         </div>
       </div>
    );
  }
}

export default Lecturer;
