import openSocket from 'socket.io-client';
import React, { Component } from 'react';

//change to heroku for deployment
//const socket = openSocket('group26-backend.herokuapp.com');
const socket = openSocket('http://localhost:8080');

function joinRoom(room) {
    socket.emit("join room", room);
}
function askQuestion(question, room) {
    socket.emit('question asked', question, room)
}

function onQuestionReceived(cb) {
   socket.on('question received', questionTally => cb(questionTally));
}

function connectLecturer(room, cb) {
    joinRoom(room);
    socket.on('on lecturer connect', questionMap => cb(questionMap));
    socket.emit('lecturer connect', room);
}

function onClearAll(cb) {
    socket.on('on clear all', () => cb());
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
        <a class={className1} href="/">
          <p>Home</p>
        </a>
        <a class={className2} href="/room">
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
        <div class="footer_nav_item">
          <a class="footer_nav_link" href="/">Home</a>
        </div>
        <div class="footer_nav_item">
          <a class="footer_nav_link" href="/room">Room</a>
        </div>
      </div>
      <img id="footer_logo" src="/app_logo.png"/>
    </div>
  );
}

export {
    joinRoom,
    onClearAll,
    clearAll,
    askQuestion,
    onQuestionReceived,
    connectLecturer,
    answerQuestion,
    onQuestionAnswered,
    stopAsking,
    Header,
    onRoomsRecieved,
    connectRoom,
    Footer
}
