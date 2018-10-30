import React, { Component } from 'react';
import {
  Header
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
        </div>
      );
    }

}

export default SelectIdentity;
