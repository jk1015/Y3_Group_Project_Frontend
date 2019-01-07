import openSocket from 'socket.io-client';
import React, { Component } from 'react';

//NOTE: Don't deploy to heroku! LDAP access can only be done whilst in DoC!
//const socket = openSocket('group26-backend.herokuapp.com');

const socket = openSocket('http://cloud-vm-45-130.doc.ic.ac.uk:8080/')
//const socket = openSocket('http://localhost:8080');

function joinRoom(credentials, room, userType) {
    socket.emit("join room", credentials, room, userType);
}

function onDisconnect(questions, room) {
    socket.on('disconnected', () => socket.emit('disconnected', questions, room));
}

function askQuestion(question, user) {
    socket.emit('question asked', question, user);
}

function onQuestionReceived(cb) {
   socket.on('question received', received_question => cb(received_question));
}

function connectToRoom(credentials, room, userType, cb) {
    joinRoom(credentials, room, userType);
    socket.on('on rooms lists', lists => {
      console.log("in");
      socket.on('on lecturer connect', questionMap => cb(questionMap));
      socket.emit('lecturer connect', room);
    });
}

function onClearAll(cb) {
    socket.on('on clear all', () => cb());
}

function onJoinError(cb) {
    socket.on('on join error', error => cb(error));
}

function onRelogin(cb) {
    socket.on('on relogin', user => cb(user));
}

function clearAll(room) {
    socket.emit('clear all', room);
}

function answerQuestion(question, room) {
    socket.emit('answer question', question, room);
}

function onQuestionAnswered(cb) {
    socket.on('question answered', question => cb(question));
}

function onRoomsRecieved(cb) {
    socket.on('on rooms lists', lists => cb(lists));
}

function connectRoom() {
  socket.emit('get rooms lists');
}

function stopAsking(question, room) {
  socket.emit('stop asking', question, room);
}

function login(username, password) {
  socket.emit('login', username, password);
}

function relogin(credentials) {
  socket.emit('relogin', credentials);
}

function onCourseReceived(cb) {
  socket.on('course received', course => cb(course));
}

function onLoginError(cb) {
  socket.on('login error', message => cb(message));
}

function requestCourseData(course) {
  socket.emit('request course data', course);
}

function onCourseDataReceived(cb) {
  socket.on('course data received', data => cb(data));
}

function Header(props) {
  let title = props.value;
  let className1 = "nav_item";
  let className2 = "nav_item";
  switch (title) {
    case "Room":
      className2 = className2 + "_active";
      break;
    case "Welcome":
      className1 = className1 + "_active";
      break;
  }
  return (
    <div>
      <div id="header">
        <img id="header_logo" src="/app_logo.png"/>
        <p>{title}</p>
      </div>
      <nav id="header_nav">
        <a className={className1} href="/">
          <p>Home</p>
        </a>
        <a className={className2} href="/join">
          <p>Rooms</p>
        </a>
      </nav>
    </div>
  );
}

function Footer() {
  return (
    <div id="footer">
      <div id="footer_nav">
        <div>
          <h2><strong>QuestHub</strong></h2>
        </div>
        <div className="footer_nav_item">
          <a className="footer_nav_link" href="/">Home</a>
        </div>
        <div className="footer_nav_item">
          <a className="footer_nav_link" href="/room">Room</a>
        </div>
      </div>
      <img id="footer_logo" src="/app_logo.png"/>
    </div>
  );
}

export {
    joinRoom,
    onClearAll,
    onDisconnect,
    clearAll,
    askQuestion,
    onQuestionReceived,
    connectToRoom,
    answerQuestion,
    onQuestionAnswered,
    stopAsking,
    Header,
    onRoomsRecieved,
    connectRoom,
    Footer,
    login,
    onLoginError,
    onCourseReceived,
    onCourseDataReceived,
    requestCourseData,
    onJoinError,
    onRelogin,
    relogin
}
