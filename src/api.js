import openSocket from 'socket.io-client';
//change to heroku for deployment
const socket = openSocket('group26-backend.herokuapp.com');
//const socket = openSocket('http://localhost:8080');

function joinRoom(room) {
    socket.emit("join room", room);
}
function askQuestion(question) {
    socket.emit('question asked', question)
}

function onQuestionReceived(cb) {
   socket.on('question received', questionTally => cb(questionTally));
}

function connectLecturer(room, cb) {
    joinRoom(room);
    socket.on('on lecturer connect', questionMap => cb(questionMap));
    socket.emit('lecturer connect');
}

function onClearAll(cb) {
    socket.on('on clear all', () => cb());
}

function clearAll() {
    socket.emit('clear all');
}

function answerQuestion(question) {
    socket.emit('answer question', question);
}

function onQuestionAnswered(cb) {
    socket.on('question answered', question => cb(question));
}
  
export {
    joinRoom,
    onClearAll,
    clearAll,
    askQuestion,
    onQuestionReceived,
    connectLecturer,
    answerQuestion,
    onQuestionAnswered
}
