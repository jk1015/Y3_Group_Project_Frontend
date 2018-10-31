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
          <Header value="Welcome"/>
          <div class="welcome_page_text">
            <p>Have questions in lectures</p>
          </div>
          <div id="welcome_page_text_img">
            <p>While the lecturer is asking</p>
          </div>
          <div class="welcome_page_text">
            <p>so just ask it using QuestHub</p>
          </div>
          <Footer />
        </div>
      );
    }

}

export default SelectIdentity;
