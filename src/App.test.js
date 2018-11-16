import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import Student from './Student';
import Lecturer from './Lecturer';
import SelectIdentity from './selectIdentity';
import Join from './join';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

describe('<Join />', () => {
  it('renders join inputs', () => {
    const join_area = shallow(<Join />);
    expect(join_area.find('input').length).toEqual(3);
  });

  it('renders join box', () => {
    const join_area = shallow(<Join />);
    expect(join_area.find('div#Question_box').length).toEqual(1);
  });

  it('renders header', () => {
    const join_area = shallow(<Join />);
    expect(join_area.find('Header').length).toEqual(1);
  });

  it('renders footer', () => {
    const join_area = shallow(<Join />);
    expect(join_area.find('Footer').length).toEqual(1);
  });

  it('renders forms', () => {
    const join_area = shallow(<Join />);
    expect(join_area.find('form').length).toEqual(2);
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
