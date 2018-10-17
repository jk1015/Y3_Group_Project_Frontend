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

    onQuestionReceived((err, questionTally) => {
        let map = this.state.questionMap;
//        map.set(questionTally.question, questionTally.number);
      this.setState({
        questionMap: map
      })
    });
  }


  render() {
    return (
       <div>
       <p>Lecturer</p>
       </div>
    );
  }
}

export default Lecturer;
