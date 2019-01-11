import React, {} from 'react';
import { Scatter } from 'react-chartjs-2';
import { address } from './api';

const cookieHandler = require('./CookieHandler');

class Visualization extends React.Component {

  constructor(props) {
    super(props);
    const credentials = cookieHandler.getCookie("auth");

    this.state ={
        course: props.course,
        begin: props.begin,
        end: props.end,
        login: undefined,
        name: undefined,
        credentials: credentials,
        errorMessage: undefined,
        loading: (credentials !== undefined && credentials !== '') ? true : false,
        data: {
            datasets: [{

					label: "I don't understand!",

          backgroundColor: '#FFFF00',//"#"+((1<<24)*Math.random()|0).toString(16),
          borderColor: '#FFFF00',//"#"+((1<<24)*Math.random()|0).toString(16),

					fill: false,

					data: [

						1,

						5,

						7,

						8,

						3,

						4,

						0

					],

				}, {

					label: 'Could you slow down?',

          backgroundColor: '#FF0000',//"#"+((1<<24)*Math.random()|0).toString(16),
          borderColor: '#FF0000',//"#"+((1<<24)*Math.random()|0).toString(16),

					fill: false,

					data: [

						6,

						7,

						2,

						5,

						8,

						9,

						5

					],

				}]
      },
        options: {
          scales: {
            xAxes: [{
						  scaleLabel: {
							  display: true,
							  labelString: 'Time',
						  },
              ticks:{
                userCallback: function(tick)
                {
                  if(tick === (props.end-props.begin) / 1000)
                    return '';
                  let second = tick % 60;
                  let minute = (tick-second)/60;
									return ((minute-minute%10)/10).toString() + (minute%10).toString() + ':' + ((second-second%10)/10).toString() + (second%10).toString();
							  },
                max:(props.end-props.begin)/1000
              }
					  }],
					  yAxes: [{
						  scaleLabel: {
							  display: true,
							  labelString: 'Votes'
						  }
              // ticks:{
              //   display: true,
              //   beginAtZero: true,
              //   min:0,
              //   max:5
              // }
					  }]
				  }
        }
      }
  }
  makeData(data){
    // let q={};
    // for(let i=0;i<data.questions.length;i++)
    // {
    //   if("course" in data.questions[i])
    //   {
    //     if(!(data.questions[i].course in q))
    //     {
    //       if("timestamp_stopped" in data.questions[i])
    //         q[data.questions[i].course]=[[data.questions[i].question,data.questions[i].timestamp_added%3600000,data.questions[i].timestamp_stopped%3600000]];
    //       else
    //         q[data.questions[i].course]=[[data.questions[i].question,data.questions[i].timestamp_added%3600000]];
    //     }
    //     else {
    //       if("timestamp_stopped" in data.questions[i])
    //         q[data.questions[i].course].append([data.questions[i].question,data.questions[i].timestamp_added%3600000,data.questions[i].timestamp_stopped%3600000]);
    //       else
    //         q[data.questions[i].course].append([data.questions[i].question,data.questions[i].timestamp_added%3600000]);
    //     }
    //   }
    // }
    // let totalQuestionsCount={};
    // for(let key in q)
    // {
    //   if(key in totalQuestionsCount)
    //   {
    //     if(q[key][0] in totalQuestionsCount[key])
    //     {
    //       totalQuestionsCount[key][q[key][0]][q[key][0]]++;
    //       if(totalQuestionsCount[key][q[key][0]][2])
    //       totalQuestionsCount[key][q[key][0]][q[key][0]]--;
    //     }
    //     else {
    //       totalQuestionsCount[key][q[key][0]]=new Array(3600).fill(0);
    //       totalQuestionsCount[key][q[key][0]][q[key][0]]++;
    //       if(totalQuestionsCount[key][q[key][0]][2])
    //       totalQuestionsCount[key][q[key][0]][q[key][0]]--;
    //     }
    //   }
    //   else {
    //     totalQuestionsCount[key]={};
    //     totalQuestionsCount[key][q[key][0]]=new Array(3600).fill(0);
    //     totalQuestionsCount[key][q[key][0]][q[key][0]]++;
    //     if(totalQuestionsCount[key][q[key][0]][2])
    //     totalQuestionsCount[key][q[key][0]][q[key][0]]--;
    //   }
    // }
    // let totalQuestionsCount;
    // let dataNew=this.state.data;
    // dataNew.datasets=[];
    // // for(let key1 in totalQuestionsCount)
    // // {
    // let key1=this.state.course;
    let q={};
    for(let i=0;i<data.questions.length;i++)
    {
      if(!(data.questions[i].question in q))
      {
        if("timestamp_stopped" in data.questions[i])
          q[data.questions[i].question]=[[data.questions[i].timestamp_added,data.questions[i].timestamp_stopped]];
        else
          q[data.questions[i].question]=[[data.questions[i].timestamp_added]];
      }
      else
      {
        if("timestamp_stopped" in data.questions[i])
        {
          q[data.questions[i].question].push([data.questions[i].timestamp_added,data.questions[i].timestamp_stopped]);
        }
        else
        {
          q[data.questions[i].question].push([data.questions[i].timestamp_added]);
        }
      }
    }
    let beginSecond=(this.state.begin-this.state.begin%1000)/1000;
    let endSecond=(this.state.end-this.state.end%1000)/1000;
    let totalLen=endSecond-beginSecond;
    let qCount={};
    let dataNew=this.state.data;
    dataNew.datasets=[];
    for(let key in q)
    {
      qCount[key]=new Array(totalLen).fill(0);
      for(let i=0;i<q[key].length;i++)
      {
        qCount[key][(q[key][i][0]-q[key][i][0]%1000)/1000-beginSecond]++;
        if(q[key][i][1])
          qCount[key][(q[key][i][1]-q[key][i][1]%1000)/1000-beginSecond]--;
      }
      let lineData=[];
      let count=0;
      for(let i=0;i<totalLen;i++)
      {
        if(qCount[key][i]!==0)
        {
          count+=qCount[key][i];
          lineData.push({x:i,y:count});
        }
      }
      lineData.push({x:totalLen,y:count});
      let color="#"+((1<<24)*Math.random()|0).toString(16);
      dataNew.datasets.push({
        label:key,
        borderColor:color,
        backgroundColor:color,
        pointBorderColor:color,
        pointBackgroundColor:color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        showLine: true,
        steppedLine:true,
        lineTension: 0.2,
        lineBorderColor: color,
        lineBackgroundColor: color,
        fill:false,
        data:lineData
      })
    }
    // for(let key2 in totalQuestionsCount[key1])
    // {
    //   let lineData=[];
    //   let count=0;
    //   for(let i=0;i<3600;i++)
    //   {
    //     if(totalQuestionsCount[key1][key2][i]!=0)
    //     {
    //       count+=totalQuestionsCount[key1][key2][i];
    //       lineData.append({x:i,y:count})
    //     }
    //   }
    //   dataNew.datasets.append({
    //     label:key2,
    //     backgroundColor:"#"+((1<<24)*Math.random()|0).toString(16),
    //     borderColor:"#"+((1<<24)*Math.random()|0).toString(16),
    //     fill:false,
    //     data:lineData
    //   })
    // }
    this.setState({data:dataNew});
    // }
  }

  componentDidMount(){
    fetch(address + '/data/' + this.state.course, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        start_time:this.state.begin,
        end_time:this.state.end
      })
    })
    .then(res =>{
      return res.json();
    })
    .then(data =>{
      this.makeData(data);
    })
    .catch((err) => {
      //Error
    })

  }

  render() {

           return (<div className="container">
           <h2 className="display-4 my-5">Votes of questions</h2>
             <Scatter className="my-5"
               data={this.state.data}
               options={this.state.options}
             />
           </div>)
  }
}

export default Visualization;
