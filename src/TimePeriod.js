import React, {} from 'react';

const cookieHandler = require('./CookieHandler');

function redirectTo(url, logout) {
  if(logout){
    cookieHandler.setCookie('auth', '');
  }
  window.location.href = url;
}

function returnOptionList(startno, endno) {
  let nums = [];
  for (let i = startno; i <= endno; i++) {
    nums.push(i);
  }
  let list = nums.map((num)=>{
    return <option key={num} value={num}>{num}</option>
  });
  return list;
}

class TimePeriod extends React.Component {

  constructor(props) {
    super(props);
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
    let dayTime=this.state.month+'/'+this.state.day+'/'+this.state.year;
    let begin=new Date(dayTime).getTime()+this.state.begin_hour*3600000;
    let end=new Date(dayTime).getTime()+this.state.end_hour*3600000;
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
          <label htmlFor="year">year</label>
          <select className="form-control" id="year" defaultValue={this.state.year} onChange={this.updateYear.bind(this)}>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>
          </div>
          <div className="form-group">
          <label htmlFor="month">month</label>
          <select className="form-control" id="month" defaultValue={this.state.month} onChange={this.updateMonth.bind(this)}>
            {returnOptionList(1, 12)}
          </select>
          </div>
          <div className="form-group">
          <label htmlFor="day">day</label>
          <select className="form-control" id="day" defaultValue={this.state.day} onChange={this.updateDay.bind(this)}>
            {returnOptionList(1, 31)}
          </select>
          </div>
          <div className="form-group">
          <label htmlFor="begin">hour at begin</label>
          <select className="form-control" id="begin" defaultValue={this.state.begin_hour} onChange={this.updateBegin.bind(this)}>
            {returnOptionList(7, 22)}
          </select>
          </div>
          <div className="form-group">
          <label htmlFor="end">hour at end</label>
          <select className="form-control" id="end" defaultValue={this.state.end_hour} onChange={this.updateEnd.bind(this)}>
            {returnOptionList(8, 23)}
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
