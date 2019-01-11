import React, { Component } from 'react';
import {
    onClearAll,
    clearAll,
    connectLecturer,
    onQuestionReceived,
    onQuestionAnswered,
    joinRoom,
    Header,
    onRoomsRecieved,
    connectRoom,
    Footer
} from './api';

let HtmlToReactParser = require('html-to-react').Parser;
let htmlToReactParser = new HtmlToReactParser();
const HashMap = require('hashmap');

function makeRoom(room) {
  let html_component =
    '<div className="question">' +
      '<p>' + room.toString() + '</p>' +
      '<div className="button_info">' +
        '<a className="question_link" href="/lecturer/' + room.toString() + '">' +
          'goto lecturer room' +
        '</a>' +
      '</div>' +
      '<div className="button_info">' +
        '<a className="question_link" href="/student/' + room.toString() + '">' +
          'goto student room' +
        '</a>' +
      '</div>' +
    '</div>';
  return html_component;
}

function Rooms(props) {
  let rooms = props.value;
  let i, res = "<br/>";
  for (i = 0; i < rooms.length; i++) {
    res = res + makeRoom(rooms[i]);
  }
  let jsx_res = htmlToReactParser.parse(res);
  return (
    jsx_res
  );
}

class Room extends Component {

  constructor(props) {
    super(props);

    this.state = {
       rooms: [],
       roomName: ""
    }

    this.createRoom = this.createRoom.bind(this);
    this.updateRoomField = this.updateRoomField.bind(this);

    connectRoom();

    onRoomsRecieved(rooms => {
      this.setState({rooms: rooms, roomName: this.state.roomName});
    });

  }

  createRoom() {
    joinRoom(this.state.roomName);
  }

  updateRoomField(e) {
    this.setState({roomName: e.target.value});
  }

  render() {
    return (
      <div>
        <Header value="Room"/>
        <div id="Question_box">
          <h2>CREATE NEW ROOM</h2>
          <form id="Question_form">
            <input type="text" value={this.state.roomName}
              onChange={this.updateRoomField}/>
          </form>
          <button onClick={this.createRoom}>Create Room</button>
        </div>
        <Rooms value={this.state.rooms}/>
        <Footer />
      </div>
    );
  }
}

export default Room;
