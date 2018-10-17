import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

function askQuestion(question) {
    socket.emit('question asked', question)
}

function onQuestionReceived(cb) {
    socket.on('question received', questionTally => cb(null, questionTally));
//    socket.emit('question asked', "Luksz")
}

function connectLecturer(cb) {
    socket.on('on lecturer connect', questionMap => cb(null, questionMap));
    socket.emit('lecturer connect');
}

export { subscribeToTimer, askQuestion, onQuestionReceived, connectLecturer }