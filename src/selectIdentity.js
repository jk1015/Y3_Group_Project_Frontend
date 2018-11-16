import React, { Component } from 'react';
import {
  Header,
  Footer
} from './api';

class SelectIdentity extends Component {

  constructor(props) {
    super(props);
  }

    render()
    {
      return(
        <div>
          <Header value="QuestHub"/>
          <div className="welcome_page_text">
            <p>Increasing engagement in the classroom through technology</p>
          </div>
          <div id="welcome_page_text_img">
            <p>Ask questions without disrupting</p>
          </div>
          <div className="welcome_page_text">
            <p>Receive better feedback</p>
          </div>
          <Footer />
        </div>
      );
    }

}

export default SelectIdentity;
