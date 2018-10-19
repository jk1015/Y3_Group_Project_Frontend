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

listQuestion()
{
  var i;
  var askedQuestions="";
  for(i in this.state.questionMap)
  {
    askedQuestions+=this.state.questionMap[i].toString()+"<br>";
  }
  return askedQuestions
}


  render() {
    let element = <h1>TEST</h1>
    return (
       <div>
         {element}
         <p>Lecturer</p>
           <tr></tr>
         <p className="DontUnderstandText">Number of students who don't understand: {this.state.questionMap.get("I don't understand")}</p>
         <p></p>
       </div>
    );
  }
}

export default Lecturer;
