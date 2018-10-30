import React, { Component } from 'react';

import {
    onClearAll,
    clearAll,
    connectLecturer,
    onQuestionReceived,
    onQuestionAnswered,
    answerQuestion
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
        map.set(questionTally.question, questionTally.number);
        console.log("Question received:" + questionTally.question);
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
      <div>
        {question[0]}: {question[1]}
        <button onClick={()=>answerQuestion(question[0])}>Answer</button>
      </div>
    );
    return (
       <div>
         <p>Lecturer</p>
           <tr></tr>
         <p className="DontUnderstandText">Number of students who don't understand: {this.state.questionMap.get("I don't understand")}</p>
         <p className="ExampleText">Number of students who want an example: {this.state.questionMap.get("Could you give an example?")}</p>
         <p className="SlowDownText">Number of students who ask for slowing down: {this.state.questionMap.get("Could you slow down?")}</p>
         <p className="SpeedUpText">Number of students who ask for speeding up: {this.state.questionMap.get("Could you speed up?")}</p>
         <div id="Clear">
           <button className="button_info" onClick={()=>clearAll()}>CLEAR ALL!</button>
         </div>
         <div>{questionList}</div>

       </div>
    );
  }
}

export default Lecturer;
