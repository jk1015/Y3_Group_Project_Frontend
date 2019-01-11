import React, { Component } from 'react';
import {
  login,
  onLoginError,
  onCourseReceived,
  onCourseDataReceived,
  relogin
} from './api';
import { ClipLoader } from 'react-spinners';

// Flag determines whether to join room 000 automatically
const testing = true;


const cookieHandler = require('./CookieHandler');

function redirectTo(url, logout) {
  if(logout){
    cookieHandler.setCookie('auth', '');
  }
  window.location.href = url;
}

class Join extends Component {

  constructor(props) {
    super(props);

    const credentials = cookieHandler.getCookie("auth");

    this.state = {
      roomName : "",
      user : "",
      password : "",
      courses : [],
      currentcourse : undefined,
      error: undefined,
      isLecturer : false,
      loggedIn : false,
      displayName : "",
      login : "",
      courseData : null,
      loading: (credentials !== undefined && credentials !== '') ? true : false
    }

    this.updateRoomField = this.updateRoomField.bind(this);
    this.updateUserField = this.updateUserField.bind(this);
    this.updatePasswordField = this.updatePasswordField.bind(this);
    this.redirectToRoom = this.redirectToRoom.bind(this);
    this.loginUser = this.loginUser.bind(this);

    if(credentials !== undefined && credentials !== ''){
      relogin(credentials);
    }

    onCourseReceived(course => {
      this.setState({loading: false});

      if(course && course.token)
        cookieHandler.setCookie('auth', course.token, 30);

      let isLecturer = false;
      if (course.doc_user === "lecturer") {
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
      if (testing && this.state.currentcourse === undefined) {
        this.setState({currentcourse : "000"});
      }
      if (!isLecturer) {
        this.redirectToRoom();
      }

    });

    onLoginError(message => {
      this.setState({error: message, loading: false});
    });

    onCourseDataReceived(data => {
      this.setState({courseData : data});
    });
  }

  redirectToRoom() {
    if(this.state.currentcourse !== undefined){
      if (!this.state.isLecturer) {
        redirectTo('/student/' + this.state.currentcourse);
      } else {
        redirectTo('/lecturer/' + this.state.currentcourse)
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

  loginUser(event) {
    event.preventDefault();
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
    let url = '/timeperiod/' + course;
    window.location.href = url;
    redirectTo('/timeperiod/' + course);
  }

  getAllLectureTimes(events) {
    let startDate = new Date(2018, 6, 2);
    let workingDate = new Date(startDate);
    let sessions = events.length;
    let dates = []
    for (let i = 0; i < 52; i++) {
      for (let j = 0; j < sessions; j++) {
        if (events[j].rawweeks[i] === 'Y') {
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

  render(){

      let loginBox;
      if (!this.state.loggedIn) {
        loginBox =
        <div>
        <h2>Login</h2>
        <form id="Login" onSubmit={this.loginUser}>
          <h3>Username</h3>
            <input type="text" value={this.state.user}
              onChange={this.updateUserField}/>
          <h3>Password</h3>
            <input type="password" value={this.state.password}
              onChange={this.updatePasswordField}/>
          <button type="submit">Login</button>
        </form>
        <p>{this.state.error}</p>
        </div>
      } else {
        loginBox =
        <div>
        <p>Logged in as: {this.state.displayName}</p>
        <p>Type: {this.state.isLecturer ? "Lecturer" : "Student"}</p>
        <button id="logout" type="button" onClick={()=>redirectTo('', true)}>Logout</button>
        </div>
      }

      let courseList, allCourseButtons;
      if(this.state.courses){
        courseList = this.state.courses.map((course) =>
          <p key={course}>{course}</p>);

        allCourseButtons = this.state.courses.map((course) =>
          <button key={course} type="button" onClick={()=>this.getCourseTimes(course)}>{course}</button>);
      }

      let courseButton = null;
      if (this.state.currentcourse !== undefined) {
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
      let courseDisplay = null;
      if (this.state.courses && this.state.courses.length > 0) {
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

      let mainView;
      if(!this.state.loading){
        mainView = <div>
          {loginBox}
          {courseDisplay}
          <p>{this.state.courseData != null ? this.state.courseData.subheading : ""}</p>
          {courseData}
        </div>
      }

      return(
        <div>
          {/* <Header value="CUTe"/> */}

            <div id="Question_box">
              {mainView}
              <ClipLoader
                 // className={override}
                 sizeUnit={"px"}
                 size={50}
                 color={'#0336FF'}
                 loading={this.state.loading}
               />
            </div>

          {/* <Footer /> */}
        </div>
      );
    }

}

export default Join;
