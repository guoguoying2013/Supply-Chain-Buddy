import axios from 'axios';
import React from 'react';
import Note from './Note.jsx'

class SingleOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: null
    }
    this.fetchMessages = this.fetchMessages.bind(this);
  }

  componentDidMount() {
    this.fetchMessages();
  }

  fetchMessages() {
    axios.get('/messages', {
      params: {
        order_number: this.props.order_number
      }
    })
      .then((response) => {
        this.setState({
          messages: response.data,
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    let po = this.props.order_info;
    return(
      <div className="single-order-modal">
        <div className="single-order-modal-content">
          <div className="po-detail-modal-top">
            <div className="po-detail-modal-top-left">
              <img className="vendor-img" src={po.vendor_photo_url}></img>
            </div>
            <div className="po-detail-modal-top-right">
              <div className="po-vendor"> {po.vendor_name}</div>
              <div className="po-number">PO Number:    {po.order_number}</div>
              <div className="po-date">PO Date:    {this.props.formatDate(po.order_issue_date)}</div>
              <div className="po-due-date">Required Shipping Date: {this.props.formatDate(po.required_shipping_date)}</div>
              <div className="po-status">Status:    {po.status}</div>
              <div className="po-tracking">Tracking Number: {this.props.tracking}</div>
            </div>
          </div>
          {this.state.messages && (
            <Note messages={this.state.messages} order_number={this.props.order_number} username={this.props.username}/>
          )}
          <button type="button" onClick={this.props.toggleModal}>Close</button>
        </div>
      </div>
    )
  }
}

export default SingleOrderModal;