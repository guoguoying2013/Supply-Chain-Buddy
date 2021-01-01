import React from 'react';
import axios from 'axios';
import UserProfileBox from './UserProfileBox.jsx';
import PurchaseOrder from './PurchaseOrder.jsx';
import CustomerOrder from './CustomerOrder.jsx';

// this.prop.user_id
// searche by customer_id => PO, search by vendor_id => CO, shown when not none
// each PO : po#, po_date, po_status(allow to change to close)
  // click to an individula PO, bring out all notes.
  // allow to create a new note, when new note created, an email would be sent out.
// each CO : co#, co_date, co_status(allow to change to ship)
  // click to an individula CO, bring out all notes.
  // allow to create a new note, when new note created, an email would be sent out.

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_orders: [],
      purchase_orders: [],
    }
    this.fetchOrders = this.fetchOrders.bind(this);
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders() {
    console.log('user_id recieved by fetchOrders: ', this.props.userId)
    axios.get('/orders', {
      params: {
        user_id: this.props.userId,
      }
    })
      .then((res) => {
        console.log('res.data, get request: ', res.data)
        this.setState({
          customer_orders: res.data.customer_orders,
          purchase_orders: res.data.purchase_orders
        })
      })
      .catch((err) => {
        console.log('fetchOrder got err: ', err);
      })
  }

  // createOrders() {
  //   axios.post('/orders')
  // }

  // updateOrders() {
  //   axios.put('/orders')
  // }

  render() {
    return (
      <div className="dashboard">
        <div className="user-info">
          {/* <UserProfileBox userId={this.props.userId}/> */}
        </div>
        <div className="orders">
          <div className="section">Purchase Orders</div>
          <div className="purchase-orders">
            {this.state.purchase_orders.length !== 0 && (
              this.state.purchase_orders.map((po) => {
                console.log('inside Dashboard purchase-orders po:', po);
                return(<PurchaseOrder po={po} username={this.props.username}/>)
              })
            )}
          </div>
          <div className="section">Customer Orders</div>
          <div className="purchase-orders">
            {this.state.customer_orders.length !== 0 && (
              this.state.customer_orders.map((co) => {
                console.log('inside Dashboard purchase-orders co:', co);
                return(<PurchaseOrder po={co} username={this.props.username}/>)
              })
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;