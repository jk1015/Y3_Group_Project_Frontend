import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Student from './Student';
import Lecturer from './Lecturer';
import SelectIdentity from './selectIdentity';
import Room from './Room';

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
       <Router>
          <div className="App">

          <Route exact path='/'
                render={() => <SelectIdentity/>}
              />

          <Route exact path='/room'
                render={() => <Room/>}
              />

          <Route exact path='/student/:room'
                render={({match}) => <Student value={match.params.room}/>}
              />

          <Route exact path='/lecturer/:room'
                render={({match}) => <Lecturer value={match.params.room}/>}
              />
          </div>
      </Router>
    );
  }
}

export default App;
