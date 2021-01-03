import React from 'react';
import axios from 'axios';
import UserProfileBox from './UserProfileBox.jsx';
import PurchaseOrder from './PurchaseOrder.jsx';
import EnterNewOrderModal from './EnterNewOrderModal.jsx';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_orders: [],
      purchase_orders: [],
      newOrderForm: false,
      suppliers: [],
      customers: [],
    }
    this.fetchOrders = this.fetchOrders.bind(this);
    this.addNewOrder = this.addNewOrder.bind(this);
    this.fetchPartners = this.fetchPartners.bind(this);
  }

  componentDidMount() {
    this.fetchOrders();
    this.fetchPartners();
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

  fetchPartners() {
    axios.get('/partners', {
      params: {
        user_id: this.props.userId,
      }
    })
      .then((res) => {
        let customers = [];
        let suppliers = [];
        res.data.customers.map((customer) => {
          customers.push([customer.customer_company, customer.customer_id]);
        });
        res.data.suppliers.map((supplier) => {
          suppliers.push([supplier.vendor_company, supplier.vendor_id]);
        });
        this.setState({
          suppliers: suppliers,
          customers: customers,
          suppliers_obj: res.data.suppliers,
          customers_obj: res.data.customers,
        })
      })
      .catch((err) => {
        console.log('fetchPartners got err: ', err);
      })
  }

  addNewOrder(e) {
    e.preventDefault();
    if(this.state.newOrderForm) {
      this.setState({
        newOrderForm: false,
      })
      this.fetchOrders();
    } else {
      this.setState({
        newOrderForm: true
      })
    }
  }

  // updateOrders() {
  //   axios.put('/orders')
  // }

  render() {
    return (
      <div className="dashboard">
        <div className="dashbaord-left">
          <div className="user-info">
            <UserProfileBox userId={this.props.userId}/>
          </div>
          <div className="navigation-bar-left">
            <button className="button-left-nav-bar">Orders</button>
            <button className="button-left-nav-bar">Suppliers</button>
            <button className="button-left-nav-bar">Customers</button>
          </div>
        </div>
        <div className="dashbaord-right">
          <div className="orders">
            <div className="section">Purchase Orders</div>
            <div className="purchase-orders">
              <div className="add-new-box" onClick={this.addNewOrder}>
                <i class="fas fa-plus-circle"></i>
              </div>
              {this.state.purchase_orders.length !== 0 && (
                this.state.purchase_orders.map((po) => {
                  console.log('inside Dashboard purchase-orders po:', po);
                  return(<PurchaseOrder po={po} username={this.props.username}/>)
                })
              )}
            </div>
            <div className="section">Customer Orders</div>
            <div className="purchase-orders">
              <div className="add-new-box" onClick={this.addNewOrder}>
                <i class="fas fa-plus-circle"></i>
              </div>
              {this.state.customer_orders.length !== 0 && (
                this.state.customer_orders.map((co) => {
                  console.log('inside Dashboard purchase-orders co:', co);
                  return(<PurchaseOrder po={co} username={this.props.username}/>)
                })
              )}
            </div>
          </div>
          {this.state.newOrderForm && (<EnterNewOrderModal
                                         customers={this.state.customers}
                                         suppliers={this.state.suppliers}
                                         user_id={this.props.userId}
                                         username={this.props.username}
                                         suppliers_obj={this.state.suppliers_obj}
                                         customers_obj={this.state.customers_obj}
                                         toggleForm = {this.addNewOrder}
                                       />)}
        </div>
      </div>
    )
  }
}

export default Dashboard;