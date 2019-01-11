import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Student from './Student';
import Lecturer from './Lecturer';
import Visualization from './Visualization';
import TimePeriod from './TimePeriod';
import Join from './join';

class App extends Component {

  render() {
    return (
       <Router>
          <div className="App">

          <Route exact path='/'
              render={() => <Join/>}
            />

          <Route exact path='/student/:room'
              render={({match}) => <Student room={match.params.room}/>}
            />

          <Route exact path='/lecturer/:room'
              render={({match}) => <Lecturer room={match.params.room}/>}
            />

          <Route exact path='/timeperiod/:course'
              render={({match}) => <TimePeriod course={match.params.course}/>}
            />

          <Route exact path='/visualization/:course/:begin/:end'
              render={({match}) => <Visualization course={match.params.course} begin={match.params.begin} end={match.params.end}/>}
            />

          </div>
      </Router>
    );
  }
}

export default App;
