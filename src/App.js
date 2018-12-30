import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Student from './Student';
import Lecturer from './Lecturer';
import SelectIdentity from './selectIdentity';
import Room from './Room';
import Join from './join';

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
       <Router>
          <div className="App">

          <Route exact path='/'
                render={() => <Join/>}
              />

          <Route exact path='/room'
                render={() => <Room/>}
              />

          <Route exact path='/join'
                render={() => <Join/>}
              />

          <Route exact path='/student/:name/:login/:room'
                render={({match}) => <Student value={[match.params.name,
                  match.params.login,
                  match.params.room]}/>}
              />

          <Route exact path='/lecturer/:name/:login/:room'
                render={({match}) => <Lecturer value={[match.params.name,
                  match.params.login,
                  match.params.room]}/>}
              />
          </div>
      </Router>
    );
  }
}

export default App;
