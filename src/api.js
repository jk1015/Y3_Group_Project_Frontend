import openSocket from 'socket.io-client';

const address = 'http://localhost:8080';
//const address = 'http://cloud-vm-45-130.doc.ic.ac.uk:8080/'
const socket = openSocket(address);

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
      socket.on('on lecturer connect', questionMaps => cb(questionMaps));
      socket.emit('lecturer connect', room); //Lecturer?
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

function answerStudentQuestion(question, answer, room) {
    socket.emit('answer student question', question, room);
}

function answerLecturerQuestion(question, answer, room) {
    socket.emit('answer lecturer question', question, answer, room);
}

function onStudentQuestionAnswered(cb) {
    socket.on('student question answered', answer => cb(answer));
}

function onLecturerQuestionAnswered(cb) {
    socket.on('lecturer question answered', answer => cb(answer) )
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

export {
    address,
    joinRoom,
    onClearAll,
    onDisconnect,
    clearAll,
    askQuestion,
    onQuestionReceived,
    connectToRoom,
    answerStudentQuestion,
    onStudentQuestionAnswered,
    answerLecturerQuestion,
    onLecturerQuestionAnswered,
    stopAsking,
    onRoomsRecieved,
    connectRoom,
    login,
    onLoginError,
    onCourseReceived,
    onCourseDataReceived,
    requestCourseData,
    onJoinError,
    onRelogin,
    relogin
}
