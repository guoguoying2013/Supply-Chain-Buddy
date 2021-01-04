import React from 'react';
import axios from 'axios';
import {XYPlot, LineSeries, RadialChart} from 'react-vis';

class SuppliersEvaluation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieChartInput:[]
    };
    this.fetchOrderHistory = this.fetchOrderHistory.bind(this);
    this.processDataForPieChart = this.processDataForPieChart.bind(this);
  }

  componentDidMount() {
    this.fetchOrderHistory();
  }

  fetchOrderHistory() {
    axios.get('/history', {
      params: {
        suppliers: this.props.suppliers,
      }
    })
    .then((res) => {
      console.log('res.data, get request: ', res.data)
      let pieChartInput = this.processDataForPieChart(res.data.sumByVendors);
      this.setState({
        pieChartInput: pieChartInput
      })
    })
    .catch((err) => {
      console.log('fetchOrderHistory got err: ', err);
    })
  }

  processDataForPieChart(data) {
    console.log('input data: ', data);
    //array of objects //{ title: 'One', value: 10, color: '#E38627' },
    const colors = ['#5CDB95', '#F13C20', '#EDC7B7', '#05386B'];
    let pieChartInput = [];
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total = total + data[i].s;
    }
    for (let i = 0; i < data.length; i++) {
      let entry = {};
      let ratio = data[i].s * 100 / total;
      let r = ratio.toFixed(2)
    //   entry.title = data[i].group;
    //   entry.value = data[i].s;
    //   entry.color = colors[i];
      entry.angle = data[i].s;
      entry.label = data[i].group + ': ' + r + '%';
      entry.color = colors[i];
      pieChartInput.push(entry);
    }
    console.log('pieChartInput: ', pieChartInput);
    return pieChartInput;
  }

  render() {
    console.log(this.props.suppliers); // use this one
    console.log(this.props.suppliers_obj);
    return (
      <div className="suppliers-evaluation">
        <div id="pieChart">
            <h3>Pie Chart</h3>
            <RadialChart
            data={this.state.pieChartInput}
            width={300}
            height={300}
            colorType="literal"
            labelsAboveChildren={true}
            showLabels={true}
            />
        </div>
      </div>
    )
  }
}

export default SuppliersEvaluation;