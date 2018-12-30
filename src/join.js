import React, { Component } from 'react';
import {
  Header,
  Footer,
  login,
  onLoginError,
  onCourseReceived,
  onCourseDataReceived,
  requestCourseData
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
      login : "",
      courseData : null
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

    onCourseDataReceived(data => {
      console.log(data);
      this.setState({courseData : data});
      console.log(this.getAllLectureTimes(data.events));
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

  getCourseTimes(course) {
    requestCourseData(course);
  }

  getAllLectureTimes(events) {
    let startDate = new Date(2018, 6, 2);
    let workingDate = new Date(startDate);
    let sessions = events.length;
    let dates = []
    for (let i = 0; i < 52; i++) {
      for (let j = 0; j < sessions; j++) {
        if (events[j].rawweeks[i] == 'Y') {
          let thisDate = new Date();
          thisDate.setDate(workingDate.getDate() + events[j].day);
          //thisDate.setTime(events[j].starttime);
          dates.push(thisDate);
        };
      };
      workingDate.setDate(workingDate.getDate() + 7);
    };
    return dates;
  }

  dayNumberToString(day) {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
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

      var allCourseButtons = this.state.courses.map((course) =>
      <button type="button" onClick={()=>this.getCourseTimes(course)}>{course}</button>);

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
        {this.state.isLecturer ? allCourseButtons : courseList}
        </div>
      }

      let courseData = <p></p>;

      if(this.state.courseData != null) {
        let events = this.state.courseData.events;
        courseData = events.map((event) =>
        <p>{this.dayNumberToString(event.day) + ": " + event.starttime + "-" + event.endtime}</p>);
      }

      return(
        <div>
          <Header value="QuestHub"/>
            {loginBox}
            {courseDisplay}
            <p>{this.state.courseData != null ? this.state.courseData.subheading : ""}</p>
            {courseData}
          <Footer />
        </div>
      );
    }

}

export default Join;
