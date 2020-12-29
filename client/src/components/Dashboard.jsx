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
      pos: [],
      cos: [],
    }
    this.fetchOrders = this.fetchOrders.bind(this);
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders() {
    axios.get('/orders')
  }

  createOrders() {
    axios.post('/orders')
  }

  updateOrders() {
    axios.put('/orders')
  }

  render() {
    return (
      <div className="dashboard">
        <div className="user-info">
          <UserProfileBox userId={this.props.userId}/>
        </div>
        <div className="orders">
          <div className="purchase-orders">
            {this.state.pos.length !== 0 && (
              this.state.pos.map((po) => {
                <PurchaseOrder po={po} />
              })
            )}
          </div>
          <div className="customer-orders">
            {this.state.cos.length !== 0 && (
              this.state.cos.map((po) => {
                <CustomerOrder co={co} />
              })
            )}
          </div>
        </div>
      </div>
    )
  }
}
const Dashboard = () => {
  console.log('dashboard is called')
  return (
    <div>This is dashbaord</div>
  )
}

export default Dashboard;