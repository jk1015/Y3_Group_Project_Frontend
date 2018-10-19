import React, { Component } from 'react';

import { connectLecturer, onQuestionReceived } from './api';
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
  }

/*String listQuestion()
{
  var i;
  Array arr=this.state.questionMap.entries();
  String askedQuestions;
  for(i=0;i<arr.length;i++)
  {
    asked
  }
}*/


  render() {
    return (
       <div>
         <p>Lecturer</p>
           <tr></tr>
         <p className="DontUnderstarndText">Number of students who don't understand: {this.state.questionMap.get("I don't understand")}</p>
         <p>{this.state.questionMap.entries().toString()}</p>
       </div>
    );
  }
}

export default Lecturer;
