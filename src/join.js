import React, { Component } from 'react';
import {
  Header,
  Footer,
  login,
  onLoginError,
  onCourseReceived
} from './api';

function redirectTo(url) {
  window.location.href = url;
}

class Join extends Component {

  constructor(props) {
    super(props);

    this.state = {
      roomName : "",
      user : "",
      password : "",
      courses : [],
      currentcourse : null,
      error: undefined,
      isLecturer : false,
      loggedIn : false,
      displayName : "",
      login : ""
    }

    this.updateRoomField = this.updateRoomField.bind(this);
    this.updateUserField = this.updateUserField.bind(this);
    this.updatePasswordField = this.updatePasswordField.bind(this);
    this.redirectToRoom = this.redirectToRoom.bind(this);

    onCourseReceived(course => {
      console.log(course);
      let isLecturer = false;
      if (course.doc_user == "lecturer") {
        isLecturer = true;
      };
      this.setState({
        currentcourse: course.lecture,
        courses: course.courses,
        loggedIn : true,
        isLecturer : isLecturer,
        displayName : course.displayName,
        login : course.login
      });
      if (!isLecturer) {
        this.redirectToRoom();
      }


    });

    onLoginError(message => {
      this.setState({error: message});
    });
  }

  redirectToRoom() {
    if(this.state.currentcourse !== null){
      if (!this.state.isLecturer) {
        redirectTo('/student/' + this.state.displayName + "/" + this.state.login +
          "/" + this.state.currentcourse);
      } else {
        redirectTo('/lecturer/' + this.state.displayName + "/" + this.state.login +
          "/" + this.state.currentcourse)
      }
    } else {
      this.setState({error: 'No lecture for any course now'});
    }
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
    this.setState({error: undefined});

    let user = this.state.user;
    let password = this.state.password;
    login(user, password);
  }

  studentPage() {
    // let url = '/student/' + this.state.roomName;
    // window.location.href = url;
  }

  lecturerPage() {
    let url = '/lecturer/' + this.state.roomName;
    window.location.href = url;
  }

  render()
    {
      var loginBox;
      if (!this.state.loggedIn) {
        loginBox =
        <div>
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
        <p>{this.state.error}</p>
        </div>
      } else {
        loginBox =
        <div>
        <p>Logged in as: {this.state.displayName}</p>
        <p>Type: {this.state.isLecturer ? "Lecturer" : "Student"}</p>
        <button type="button" onClick={()=>redirectTo('')}>Logout</button>
        </div>
      }

      var courseList = this.state.courses.map((course) =>
      <p>{course}</p>);

      var courseButton = null;
      if (this.state.currentcourse != null) {
        courseButton =
        <div>
          <h2>Lecture in progress:</h2>
          <button type="button" onClick={()=>this.redirectToRoom()}>
            Join {this.state.currentcourse}
          </button>
        </div>
      } else {
        courseButton =
        <div>
        <h2>No lectures in progress.</h2>
        <p>If you think you should be in a lecture, check your enrolment below.</p>
        </div>
      }

      var courseDisplay = null;
      if (this.state.courses.length > 0) {
        courseDisplay =
        <div>
        {courseButton}
        <h2>Courses:</h2>
        {courseList}
        </div>
      }



      return(
        <div>
          <Header value="QuestHub"/>
            {loginBox}
            {courseDisplay}
          <Footer />
        </div>
      );
    }

}

export default Join;
