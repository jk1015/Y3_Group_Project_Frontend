import openSocket from 'socket.io-client';
//change to heroku for deployment
const socket = openSocket('http://localhost:8080');

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

export { askQuestion, onQuestionReceived, connectLecturer, onClearAll }
