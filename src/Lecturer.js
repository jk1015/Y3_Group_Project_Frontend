import React, { Component } from 'react';

import { onClearAll, clearAll, connectLecturer, onQuestionReceived } from './api';
const HashMap = require('hashmap');

class Lecturer extends Component {

  constructor(props) {
    super(props);

    this.state ={
        questionMap: new HashMap()
    }

    connectLecturer((err, questionMap) =>{
      let map = new HashMap();
      map.copy(questionMap)
      this.setState({
        questionMap: map
      })
    });

    onQuestionReceived((err, questionTally) => {
      let map = this.state.questionMap;
      map.set(questionTally.question, questionTally.number);
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
    var questions = new Array();
    this.state.questionMap.keys().forEach(
           function(key) {
             questions.push(<div>{key}: {this.state.questionMap.get(key)}</div>);
           }, this)

    return (
       <div>
         <p>Lecturer</p>
           <tr></tr>
         <p className="DontUnderstandText">Number of students who don't understand: {this.state.questionMap.get("I don't understand")}</p>
         <p className="ExampleText">Number of students who want an example: {this.state.questionMap.get("Could you give an example?")}</p>
         <p className="SlowDownText">Number of students who ask for slowing down: {this.state.questionMap.get("Could you slow down?")}</p>
         <p className="SpeedUpText">Number of students who ask for speeding up: {this.state.questionMap.get("Could you speed up?")}</p>
         <div id="Clear">
           <button onClick={()=>clearAll()}>CLEAR ALL!</button>
         </div>
         <div>{questions}</div>

       </div>
    );
  }
}

export default Lecturer;
