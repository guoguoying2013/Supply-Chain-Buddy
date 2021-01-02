import React from 'react';
import axios from 'axios';

class EnterNewOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state= {};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    let newOrderEntry = {
      documents: null,
      tracking: null,
      order_issue_date: Date(),
      urgency_level: 'normal',
      status: 'issued',
    }

    Object.assign(newOrderEntry, this.state);
    let customer_id_int = parseInt(newOrderEntry.customer_id);
    newOrderEntry.customer_id = customer_id_int;
    let vendor_id_int = parseInt(newOrderEntry.vendor_id);
    newOrderEntry.vendor_id = vendor_id_int;

    for (let i = 0; i < this.props.customers_obj.length; i++) {
        if(this.props.customers_obj[i].customer_id === newOrderEntry.customer_id) {
            console.log('customer i:', this.props.customers_obj[i])
            newOrderEntry.customer_company = this.props.customers_obj[i].customer_company;
            newOrderEntry.customer_photo_url = this.props.customers_obj[i].customer_photo_url;
        }
    }
    for (let i = 0; i < this.props.suppliers_obj.length; i++) {
        if(this.props.suppliers_obj[i].vendor_id === newOrderEntry.vendor_id) {
            console.log('supplier i: ', this.props.suppliers_obj[i])
            newOrderEntry.vendor_name = this.props.suppliers_obj[i].vendor_company;
            newOrderEntry.vendor_photo_url = this.props.suppliers_obj[i].vendor_photo_url;
        }
    }
    console.log('after looping', newOrderEntry);
    axios.post('/orders', newOrderEntry)
      .then((res) => {
        console.log('res at post new order modal: ', res);
        // close modal and call fetchOrders again
      })
      .catch((err) => {
        console.log('axios err: ', err);
      })
  }

  render() {
    return (
      <div className="LoginModal">
        <form className="new-order-modal-content">
        <h1>Enter New Order</h1>
          <label>Purchase Order Number</label>
          <br />
          <input type="text" value={this.state.order_number} onChange={this.handleChange} name="order_number"></input>
          <br />
          <label>Customer</label>
          <br />
          <select value={this.state.customer_id} onChange={this.handleChange} name="customer_id">
            <option></option>
            {this.props.customers.map((c) => {
              return(<option value={c[1]} name="customer_id">{c[0]}</option>)
            })}
          </select>
          <br />
          <label>Supplier</label>
          <br />
          <select value={this.state.supplier_id} onChange={this.handleChange} name="vendor_id">
            <option></option>
            {this.props.suppliers.map((s) => {
              return(<option value={s[1]} name="vendor_id">{s[0]}</option>)
            })}
          </select>
          <br />
          <label>Total Amount</label>
          <br />
          <input type="number" value={this.state.total} onChange={this.handleChange} name='total'></input>
          <br />
          <label>Expected Shipping Date</label>
          <br />
          <input type="date" value={this.state.required_shipping_date} onChange={this.handleChange} name='required_shipping_date'></input>
          <br />
          <button onClick={this.handleSubmit} className="submit-button">Submit</button>
        </form>
      </div>
    )
  }
}

export default EnterNewOrderModal;