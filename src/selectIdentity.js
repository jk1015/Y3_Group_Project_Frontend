  import React, { Component } from 'react';

class SelectIdentity extends Component {

  constructor(props) {
    super(props);
  }

    render()
    {
      return(
        <div>
        <p>I am a <a href="/Student">Student</a></p>
        <p>I am a <a href="/Lecturer">Lecturer</a></p>
        </div>
      );
    }

}

export default SelectIdentity;
