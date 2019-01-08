

import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class Visualization extends React.Component {

  constructor(props) {
    super(props);
    console.log("123");

    this.state ={
        course: "410",
        login: this.props.value[1],
        name: this.props.value[0],
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
          title: {
            text: this.props.value[0]
				  },
          scales: {
            xAxes: [{
						  scaleLabel: {
							  display: true,
							  labelString: 'Time'
						  }
					  }],
					  yAxes: [{
						  scaleLabel: {
							  display: true,
							  labelString: 'Votes'
						  }
					  }]
				  }
        }
      }


  //       fetch('http://cloud-vm-45-130.doc.ic.ac.uk:8080/data',  {
  //           method : 'GET',
  //           headers : {
  //             'Content-Type': 'application/json',
  //             // 'Access-Control-Allow-Origin': '*',
  //             // 'crossdomain': true
  //           }
  //           })
  //        .then(response => {
  //          response.json()})
  //        .then(data =>{
  //          console.log(data);
  //          this.makeData({data})
  //         })
  //         .catch((err) => {console.log(err);})


  }


  componentDidUpdate(){
    // console.log("IN");
    //   fetch('http://cloud-vm-45-130.doc.ic.ac.uk:8080/data')
    //    .then(response => response.json())
    //    .then(data =>{
    //      console.log(data);
    //      this.makeData({data})
    //     });
  }

  makeData(data){
    var q={};
    for(var i=0;i<data.questions.length;i++)
    {
      if("course" in data.questions[i])
      {
        if(!(data.questions[i].course in q))
        {
          if("timestamp_stopped" in data.questions[i])
            q[data.questions[i].course]=[[data.questions[i].question,data.questions[i].timestamp_added%3600000,data.questions[i].timestamp_stopped%3600000]];
          else
            q[data.questions[i].course]=[[data.questions[i].question,data.questions[i].timestamp_added%3600000]];
        }
        else {
          if("timestamp_stopped" in data.questions[i])
            q[data.questions[i].course].append([data.questions[i].question,data.questions[i].timestamp_added%3600000,data.questions[i].timestamp_stopped%3600000]);
          else
            q[data.questions[i].course].append([data.questions[i].question,data.questions[i].timestamp_added%3600000]);
        }
      }
    }
    var totalQuestionsCount={};
    for(var key in q)
    {
      if(key in totalQuestionsCount)
      {
        if(q[key][0] in totalQuestionsCount[key])
        {
          totalQuestionsCount[key][q[key][0]][q[key][0]]++;
          if(totalQuestionsCount[key][q[key][0]][2])
          totalQuestionsCount[key][q[key][0]][q[key][0]]--;
        }
        else {
          totalQuestionsCount[key][q[key][0]]=new Array(3600).fill(0);
          totalQuestionsCount[key][q[key][0]][q[key][0]]++;
          if(totalQuestionsCount[key][q[key][0]][2])
          totalQuestionsCount[key][q[key][0]][q[key][0]]--;
        }
      }
      else {
        totalQuestionsCount[key]={};
        totalQuestionsCount[key][q[key][0]]=new Array(3600).fill(0);
        totalQuestionsCount[key][q[key][0]][q[key][0]]++;
        if(totalQuestionsCount[key][q[key][0]][2])
        totalQuestionsCount[key][q[key][0]][q[key][0]]--;
      }
    }
    var totalQuestionsCount;
    var dataNew=this.state.data;
    dataNew.datasets=[];
    // for(var key1 in totalQuestionsCount)
    // {
    var key1=this.state.course;
      for(var key2 in totalQuestionsCount[key1])
      {
        var lineData=[];
        var count=0;
        for(var i=0;i<3600;i++)
        {
          if(totalQuestionsCount[key1][key2][i]!=0)
          {
            count+=totalQuestionsCount[key1][key2][i];
            lineData.append({x:i,y:count})
          }
        }
        dataNew.datasets.append({
          label:key2,
          backgroundColor:"#"+((1<<24)*Math.random()|0).toString(16),
          borderColor:"#"+((1<<24)*Math.random()|0).toString(16),
          fill:false,
          data:lineData
        })
      }
      this.setState({data:dataNew});
    // }
  }
  render() {

           return (<div class="container">
             <Line
               data={this.state.data}
               options={this.state.options}
             />
           </div>)
  }
}

export default Visualization;
