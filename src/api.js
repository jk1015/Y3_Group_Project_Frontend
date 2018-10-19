import openSocket from 'socket.io-client';
import React, { Component } from 'react';

//change to heroku for deployment
const socket = openSocket('group26-backend.herokuapp.com');

function askQuestion(question) {
    socket.emit('question asked', question)
}

function onQuestionReceived(cb) {
   socket.on('question received', questionTally => cb(null, questionTally));
}

function connectLecturer(cb) {
    socket.on('on lecturer connect', questionMap => cb(null, questionMap));
    socket.emit('lecturer connect');
}

function onClearAll(cb) {
    socket.on('on clear all', () => cb());
}

function clearAll() {
    socket.emit('clear all');
}

function Header(props) {
  return (
    <div id="header">
      <p>{props.value}</p>
    </div>
  );
}

export { onClearAll, clearAll, askQuestion, onQuestionReceived, connectLecturer ,
 Header}
