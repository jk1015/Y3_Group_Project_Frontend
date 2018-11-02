import React, { Component } from 'react';
import {
  Header,
  Footer
} from './api';

class Join extends Component {

  constructor(props) {
    super(props);

    this.state = {
      roomName : ""
    }

    this.updateRoomField = this.updateRoomField.bind(this);


  }

  updateRoomField(e) {
    this.setState({roomName: e.target.value});
  }

  studentPage() {
    let url = '/student/' + this.state.roomName;
    window.location.href = url;
  }

  lecturerPage() {
    let url = '/lecturer/' + this.state.roomName;
    window.location.href = url;
  }

  render()
    {
      return(
        <div>
          <Header value="QuestHub"/>
            <div id="Question_box">
              <h2>Join a Room</h2>
              <form id="Question_form">
                <input type="text" value={this.state.roomName}
                  onChange={this.updateRoomField}/>
              </form>
              <button type="button" onClick={()=>this.studentPage()}>Student</button>
              <button type="button" onClick={()=>this.lecturerPage()}>Lecturer</button>
            </div>
          <Footer />
        </div>
      );
    }

}

export default Join;
