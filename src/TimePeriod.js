import React, {} from 'react';

const cookieHandler = require('./CookieHandler');

function redirectTo(url, logout) {
  if(logout){
    cookieHandler.setCookie('auth', '');
  }
  window.location.href = url;
}

class TimePeriod extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    const credentials = cookieHandler.getCookie("auth");

    this.state ={
        course: props.course,
        begin_hour: '7',
        end_hour: '8',
        year: '2019',
        month: '1',
        day: '1',
        login: undefined,
        name: undefined,
        credentials: credentials,
        errorMessage: undefined,
        loading: (credentials !== undefined && credentials !== '') ? true : false,
      }
      this.search = this.search.bind(this);
  }

  updateYear(e) {
    this.setState({year: e.target.value});
  }
  updateMonth(e) {
    this.setState({month: e.target.value});
  }
  updateDay(e) {
    this.setState({day: e.target.value});
  }
  updateBegin(e) {
    this.setState({begin_hour: e.target.value});
  }
  updateEnd(e) {
    this.setState({end_hour: e.target.value});
  }
  search() {
    var dayTime=this.state.month+'/'+this.state.day+'/'+this.state.year;
    var begin=new Date(dayTime).getTime()+this.state.begin_hour*3600000;
    var end=new Date(dayTime).getTime()+this.state.end_hour*3600000;
    // console.log(dayTime);
    // console.log(begin);
    // console.log(end);
    let url = '/visualization/' + this.state.course +'/'+ begin + '/' + end;
    window.location.href = url;
    redirectTo('/visualization/' + this.state.course +'/'+ begin + '/' + end);
  }
  render() {
    return(
      <div>
        <h2 className="display-4 my-5">Input the time period you want to search!</h2>
        <form className="container text-left">
          <div className="form-group">
          <label for="year">year</label>
          <select class="form-control" id="year" defaultValue={this.state.year} onChange={this.updateYear.bind(this)}>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>
          </div>
          <div class="form-group">
          <label for="month">month</label>
          <select class="form-control" id="month" defaultValue={this.state.month} onChange={this.updateMonth.bind(this)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="7">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          </div>
          <div class="form-group">
          <label for="day">day</label>
          <select class="form-control" id="day" defaultValue={this.state.day} onChange={this.updateDay.bind(this)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
            <option value="24">24</option>
            <option value="25">25</option>
            <option value="26">26</option>
            <option value="27">27</option>
            <option value="28">28</option>
            <option value="29">29</option>
            <option value="30">30</option>
            <option value="31">31</option>
          </select>
          </div>
          <div class="form-group">
          <label for="begin">hour at begin</label>
          <select class="form-control" id="begin" defaultValue={this.state.begin_hour} onChange={this.updateBegin.bind(this)}>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
          </select>
          </div>
          <div class="form-group">
          <label for="end">hour at end</label>
          <select class="form-control" id="end" defaultValue={this.state.end_hour} onChange={this.updateEnd.bind(this)}>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
          </select>
          </div>
          <div className="input-group-append mt-4">
            <button className="btn btn-outline-dark px-4" type="button" onClick={this.search}>Search for the data between</button>
          </div>
        </form>
      </div>
    )
  }
}

export default TimePeriod;
