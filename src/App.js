import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Student from './Student';
import Lecturer from './Lecturer';

import { subscribeToTimer } from './api';

class App extends Component {

  constructor(props) {
    super(props);

    subscribeToTimer((err, timestamp) => this.setState({
      timestamp
    }));
  }

  state = {
    timestamp: 'no timestamp yet'
  };

  render() {
    return (
       <Router>
          <div className="App">
            <p className="App-intro">
            This is the timer value: {this.state.timestamp}
            </p>
          <Route exact path='/'
                render={() => <Student/>}
              />

          <Route exact path='/lecturer'
                render={() => <Lecturer/>}
              />
          </div>
      </Router>
    );
  }
}

export default App;
