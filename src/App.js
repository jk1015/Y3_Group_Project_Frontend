import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Student from './Student';
import Lecturer from './Lecturer';
import selectIdentity from './selectIdentity';

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
       <Router>
          <div className="App">

          <Route exact path='/'
                render={() => <selectIdentity/>}
              />

          <Route exact path='/student'
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
