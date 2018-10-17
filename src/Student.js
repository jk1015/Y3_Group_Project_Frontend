import React, { Component } from 'react';

import { askQuestion } from './api';

class Student extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount(){
    askQuestion("I don't understand");
  }


  render() {
    return (
          <div>
          </div>
    );
  }
}

export default Student;
