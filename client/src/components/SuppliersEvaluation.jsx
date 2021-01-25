/* eslint-disable no-underscore-dangle */
import React from 'react';
import axios from 'axios';
import {
  XYPlot, RadialChart, VerticalGridLines, HorizontalGridLines,
  XAxis, YAxis, VerticalBarSeries, MarkSeries, Hint,
} from 'react-vis';

class SuppliersEvaluation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieChartInput: [],
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
    axios.get('/api/history', {
      params: {
        suppliers: this.props.suppliers,
      },
    })
      .then((res) => {
        const pieChartInput = this.processDataForPieChart(res.data.sumByVendors);
        const barChartInput = this.processDataForBarChart(res.data.orderHistory);
        this.setState({
          pieChartInput,
          barChartInput,
        });
      })
      .catch((err) => {
        console.log('fetchOrderHistory got err: ', err);
      });
  }

  processDataForPieChart(data) {
    const colors = ['#5CDB95', '#F13C20', '#EDC7B7', '#05386B'];
    const pieChartInput = [];
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].s;
    }
    for (let i = 0; i < data.length; i++) {
      const entry = {};
      const ratio = data[i].s * 100 / total;
      const r = ratio.toFixed(2);
      entry.angle = data[i].s;
      entry.label = `${data[i].group}: ${r}%`;
      entry.color = colors[i];
      pieChartInput.push(entry);
    }
    return pieChartInput;
  }

  processDataForBarChart(data) {
    const monthNames = ['PlaceHolder', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const finalResult = [];
    for (let k = 0; k < data.length; k += 1) {
      const input = data[k];
      const companyName = input[0];
      const { companyNames } = this.state;
      companyNames.push(companyName);
      const orders = input[1];

      const result = [
        { x: 'Jan', y: 0 },
        { x: 'Feb', y: 0 },
        { x: 'Mar', y: 0 },
        { x: 'Apr', y: 0 },
        { x: 'May', y: 0 },
        { x: 'Jun', y: 0 },
        { x: 'Jul', y: 0 },
        { x: 'Aug', y: 0 },
        { x: 'Sep', y: 0 },
        { x: 'Oct', y: 0 },
        { x: 'Nov', y: 0 },
        { x: 'Dec', y: 0 },
      ];

      for (let i = 0; i < orders.length; i += 1) {
        const date = new Date(orders[i].order_issue_date);
        for (let j = 0; j < result.length; j += 1) {
          if (monthNames.indexOf(result[j].x) === date.getMonth()) {
            result[j].y += orders[i].total;
          }
        }
      }
      finalResult.push(result);
    }
    return finalResult;
  }

  _forgetValue() {
    this.setState({
      value: null,
    });
  }

  _rememberValue(value) {
    this.setState({ value });
  }

  render() {
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
              showLabels
            />
          </div>
          <div id="pieChart-data">
            <h3>Pie Chart</h3>
            {this.state.pieChartInput.map((e) => (
              <div>
                <span>{e.label}</span>
                <br />
              </div>
            ))}
          </div>
        </div>

        {this.state.barChartInput.map((hist, index) => (
          <div className="barChart-parent">
            <div className="barChart">
              <XYPlot margin={{ bottom: 70 }} xType="ordinal" width={500} height={500}>
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
              {hist.map((e) => (
                <div>
                  <span>
                    {e.x}
                    : $
                    {e.y}
                  </span>
                  <br />
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    );
  }
}

export default SuppliersEvaluation;
