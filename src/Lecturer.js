import React, { Component } from 'react';

import { connectLecturer, onQuestionReceived } from './api';
const HashMap = require('hashmap');

class Lecturer extends Component {

  constructor(props) {
    super(props);

    this.state ={
        questionMap: new HashMap()
    }

    connectLecturer((err, questionMap) => this.setState({
      questionMap
    }));

//    onQuestionReceived((err, questionTally) => {
//        console.log("received")
////      this.setState({
////        questionMap: this.state.questionsMap.set(questionTally.question, questionTally.number)
////      })
//    });
  }


  render() {
    console.log(this.state.questionMap)
    return (
       <div>
       <p>Lecturer</p>
       </div>
    );
  }
}

export default Lecturer;
