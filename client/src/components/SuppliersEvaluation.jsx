import React from 'react';
import axios from 'axios';
import {XYPlot, LineSeries, RadialChart, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, VerticalBarSeries, MarkSeries, Hint} from 'react-vis';

class SuppliersEvaluation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieChartInput:[],
      barChartInput: [],
      value: null,
      companyNames: [],
    };
    this.fetchOrderHistory = this.fetchOrderHistory.bind(this);
    this.processDataForPieChart = this.processDataForPieChart.bind(this);
    this._forgetValue = this._forgetValue.bind(this);
    this._rememberValue = this._rememberValue.bind(this);
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
      let barChartInput = this.processDataForBarChart(res.data.orderHistory);
      this.setState({
        pieChartInput: pieChartInput,
        barChartInput: barChartInput
      })
    })
    .catch((err) => {
      console.log('fetchOrderHistory got err: ', err);
    })
  }

  processDataForPieChart(data) {
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
      entry.angle = data[i].s;
      entry.label = data[i].group + ': ' + r + '%';
      entry.color = colors[i];
      pieChartInput.push(entry);
    }
    return pieChartInput;
  }

  processDataForBarChart(data) {
    // let input = data[0]; // start with only one, input is ["Sunny Farm", Array(13)];
    const monthNames = ["PlaceHolder", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const finalResult = [];
    for (let k = 0; k < data.length; k++) {
        let input = data[k];
        let companyName = input[0];
        let companyNames = this.state.companyNames;
        companyNames.push(companyName);
        // this.setState({
        //   companyNames: companyNames
        // });
        let orders = input[1]; // array of objects
    
        let result = [
            {x: 'Jan', y: 0},
            {x: 'Feb', y: 0},
            {x: 'Mar', y: 0},
            {x: 'Apr', y: 0},
            {x: 'May', y: 0},
            {x: 'Jun', y: 0},
            {x: 'Jul', y: 0},
            {x: 'Aug', y: 0},
            {x: 'Sep', y: 0},
            {x: 'Oct', y: 0},
            {x: 'Nov', y: 0},
            {x: 'Dec', y: 0},
        ]; // array of each bar, each bar is array of obj x and y
    
        for (let i = 0; i < orders.length; i++) {
            let date = new Date(orders[i].order_issue_date);
            console.log('Month', date.getMonth(), 'company name: ', companyName, 'single dollar amout', orders[i].total);
            for (let j = 0; j< result.length; j++) {
                if (monthNames.indexOf(result[j].x) === date.getMonth()) {
                  result[j].y += orders[i].total;
                }
            }
        }
        console.log('company name',companyName, 'result',result);
        finalResult.push(result);
    }
    console.log('!!!!!!!!finalResult: ', finalResult)
    return finalResult;
    // this.setState({
    //     barChartInput: barChartOutput
    // })
    /*
    [
        {x: 'Jan', y: 10},
        {x: 'Feb', y: 5},
        {x: 'Dec', y: 15}
    ]
    */
   // start with only one vendor, input is ["Sunny Farm", Array(13)]
   // x is month, y is total issued order amount in that month
    
  }

  _forgetValue() {
    this.setState({
      value: null
    });
  };

  _rememberValue(value) {
    this.setState({value});
  };

  render() {
    console.log(this.props.suppliers);
    console.log(this.props.suppliers_obj);
    return (
      <div className="suppliers-evaluation">
        <div className="pieChart-parent">
            <div id="pieChart">
                <RadialChart
                data={this.state.pieChartInput}
                width={300}
                height={300}
                colorType="literal"
                labelsRadiusMultiplier={1.1}
                showLabels={true}
                />
            </div>
            <div id="pieChart-data">
                <h3>Pie Chart</h3>
                {this.state.pieChartInput.map((e)=>{
                    return(<div><span>{e.label}</span><br/></div>)
                })}
            </div>
        </div>

        {this.state.barChartInput.map((hist, index) => {
            return(
                <div className="barChart-parent">
                    <div className="barChart">
                        <XYPlot margin={{bottom: 70}} xType="ordinal" width={500} height={500}>
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis tickLabelAngle={-45} />
                            <YAxis />
                            <VerticalBarSeries
                                data={hist}
                            />
                            <MarkSeries
                                onValueMouseOver={this._rememberValue}
                                onValueMouseOut={this._forgetValue}
                                data={hist}
                            />
                            {this.state.value ? <Hint value={this.state.value} /> : null}
                        </XYPlot>
                    </div>
                    <div className="barChart-data">
                        <h3>{this.state.companyNames[index]}</h3>
                        {hist.map((e)=>{
                            return(<div><span>{e.x}: ${e.y}</span><br/></div>)
                        })}
                    </div>
                </div>
            )
        })}

      </div>
    )
  }
}

export default SuppliersEvaluation;