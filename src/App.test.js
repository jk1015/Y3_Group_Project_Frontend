/*import React from 'react';
import { shallow } from 'enzyme';
import { mount } from 'enzyme';
import App from './App';
import Student from './Student';
import Lecturer from './Lecturer';
import SelectIdentity from './selectIdentity';
import Join from './join';
import {
  Header,
  Footer,
  login,
  onLoginError,
  onCourseReceived,
  onCourseDataReceived,
  requestCourseData,
  relogin
} from './api'
import { configure } from 'enzyme';
import { spy, stub } from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('<Join />', () => {
  it('renders join inputs', () => {
    const join_area = shallow(<Join />);
    expect(join_area.find('input').length).toEqual(2);
  });

  // it('renders header', () => {
  //   const join_area = shallow(<Join />);
  //   expect(join_area.find('Header').length).toEqual(1);
  // });
  //
  // it('renders footer', () => {
  //   const join_area = shallow(<Join />);
  //   expect(join_area.find('Footer').length).toEqual(1);
  // });

  it('renders Question box', () => {
    const join_area = shallow(<Join />);
    expect(join_area.find('#Question_box').length).toEqual(1);
  });

  it('renders forms', () => {
    const join_area = shallow(<Join />);
    expect(join_area.find('form').length).toEqual(1);
  });

  it('calls loginUser', () => {
    let join_area = shallow(<Join/>);
    join_area.instance().loginUser = jest.fn();
    join_area.find('input').at(0).simulate('change', { target: { value: 'stu_1' } });
    join_area.find('input').at(1).simulate('change', { target: { value: '123' } });
    join_area.setState({password: "123", user: "stu_1"});
    join_area.find('form').simulate('submit');
    expect(join_area.instance().loginUser).toHaveBeenCalledTimes(1);
  });

  it('check login', () => {
    let join_area = shallow(<Join/>);
    expect(join_area.instance().state.loggedIn).toEqual(false);
    expect(join_area.contains(<h2>Login</h2>)).toEqual(true);

    join_area.setState({
      currentcourse: null,
      courses: ['000', '333', '11','12','13', '362'],
      loggedIn : true,
      isLecturer : false,
      displayName : "stu_1",
      login : "stu_1"
    });
    expect(join_area.contains(<p>Logged in as: stu_1</p>)).toEqual(true);
  });
});

describe('<SelectIdentity />', () => {
  it('renders header', () => {
    const selectIdentity_area = shallow(<SelectIdentity />);
    expect(selectIdentity_area.find('Header').length).toEqual(1);
  });

  it('renders footer', () => {
    const selectIdentity_area = shallow(<SelectIdentity />);
    expect(selectIdentity_area.find('Footer').length).toEqual(1);
  });

  it('renders welcome page text', () => {
    const selectIdentity_area = shallow(<SelectIdentity />);
    expect(selectIdentity_area.find('div.welcome_page_text').length).toEqual(2);
  });

  it('renders welcome page text img', () => {
    const selectIdentity_area = shallow(<SelectIdentity />);
    expect(selectIdentity_area.find('div#welcome_page_text_img').length).toEqual(1);
  });

  it('check welcome page text img content', () => {
    const selectIdentity_area = shallow(<SelectIdentity />);
    const content =
      '<div id="welcome_page_text_img">' +
      '<p>Ask questions without disrupting</p>' +
      '</div>';
    const real_content = selectIdentity_area.find('div#welcome_page_text_img').html();
    expect(real_content.indexOf(content) > -1).toEqual(true);
  });
});
*/
