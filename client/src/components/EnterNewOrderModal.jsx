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
    console.log('submit is clicked');
    console.log(this.state);
  }

  render() {
    return (
      <div className="LoginModal">
        <form className="new-order-modal-content">
        <h1>Enter New Order</h1>
          <label>Purchase Order Number</label>
          <br />
          <input type="text" value={this.state.order_number} onChange={this.handleChange} name='order_number'></input>
          <br />
          <label>Customer</label>
          <br />
          <input type="text" value={this.state.customer_id} onChange={this.handleChange} name='customer_id'></input>
          <br />
          <label>Supplier</label>
          <br />
          <input type="text" value={this.state.vendor_id} onChange={this.handleChange} name='vendor_id'></input>
          <br />
          {/* <label>Description</label>
          <br />
          <input type="text" value={this.state.item_description} onChange={this.handleChange} name='item_description'></input>
          <br /> */}
          <label>Total Amount</label>
          <br />
          <input type="text" value={this.state.total_amount} onChange={this.handleChange} name='total_amount'></input>
          <br />
          <button onClick={this.handleSubmit} className="submit-button">Submit</button>
        </form>
      </div>
    )
  }
}

export default EnterNewOrderModal;