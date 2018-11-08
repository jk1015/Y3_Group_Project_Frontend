import React, { Component } from 'react';
import {
  Header,
  Footer,
  login,
  onCoursesReceived
} from './api';

class Join extends Component {

  constructor(props) {
    super(props);

    this.state = {
      roomName : "",
      user : "",
      password : "",
      courses : []
    }

    this.updateRoomField = this.updateRoomField.bind(this);
    this.updateUserField = this.updateUserField.bind(this);
    this.updatePasswordField = this.updatePasswordField.bind(this);

    onCoursesReceived(courses => {
      let newList = courses.courses;
      this.setState({courses: newList});
    });
  }

  updateRoomField(e) {
    this.setState({roomName: e.target.value});
  }

  updateUserField(e) {
    this.setState({user: e.target.value});
  }

  updatePasswordField(e) {
    this.setState({password: e.target.value});
  }

  loginUser() {
    let user = this.state.user;
    let password = this.state.password;
    login(user, password);
  }

  studentPage() {
    let url = '/student/' + this.state.roomName;
    window.location.href = url;
  }

  lecturerPage() {
    let url = '/lecturer/' + this.state.roomName;
    window.location.href = url;
  }

  render()
    {
      var courseList = this.state.courses.map((course) =>
      <p>{course}</p>);

      return(
        <div>
          <Header value="QuestHub"/>
            <h2>Login</h2>
            <form id="Login">
              <h3>Username</h3>
                <input type="text" value={this.state.user}
                  onChange={this.updateUserField}/>
              <h3>Password</h3>
                <input type="password" value={this.state.password}
                  onChange={this.updatePasswordField}/>
              <button type="button" onClick={()=>this.loginUser()}>Login</button>
            </form>
            <h2>Courses:</h2>
            <p>{courseList}</p>
            <div id="Question_box">
              <h2>Join a Room</h2>
              <form id="Question_form">
                <input type="text" value={this.state.roomName}
                  onChange={this.updateRoomField}/>
              </form>
              <button type="button" onClick={()=>this.studentPage()}>Student</button>
              <button type="button" onClick={()=>this.lecturerPage()}>Lecturer</button>
            </div>
          <Footer />
        </div>
      );
    }

}

export default Join;
