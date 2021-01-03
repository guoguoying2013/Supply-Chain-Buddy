import axios from 'axios';
import React from 'react';
import Note from './Note.jsx';
import API_tracking from '../../../token_login.js';
import TrackingHistory from './TrackingHistory.jsx'

class SingleOrderModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: null,
      trackingHistory: null,
      showTracking: false,
      showMessages: false,
    }
    this.fetchMessages = this.fetchMessages.bind(this);
    this.searchTrackingAPI = this.searchTrackingAPI.bind(this);
    this.toggleMessages = this.toggleMessages.bind(this);
    this.toggleTracking = this.toggleTracking.bind(this);
  }

//   componentDidMount() {
//     this.fetchMessages();
//   }

  fetchMessages() {
    console.log('fetchMessages, order_number: ', this.props.order_number)
    axios.get('/messages', {
      params: {
        order_number: this.props.order_number
      }
    })
      .then((response) => {
        this.setState({
          messages: response.data,
          // showMessages: true,
        })
        if(this.state.showMessages) {
          setTimeout(this.fetchMessages(), 2000);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  toggleMessages() {
    if(this.state.showMessages) {
      this.setState({
          showMessages: false,
      })
    } else {
      this.setState({
        showMessages: true,
        })
      this.fetchMessages();
    }
  }

  toggleTracking() {
    if(this.state.showTracking) {
      this.setState({
      showTracking: false,
    })
    } else {
      this.searchTrackingAPI(this.props.tracking)
    }
  }

  searchTrackingAPI(trackingId) {
    console.log('trackingId: ', trackingId);
    console.log('API_tracking_key', API_tracking.API_tracking_key);
    if(trackingId !== 'Not Available') {
      axios.get(`https://api.aftership.com/v4/trackings?id=${trackingId}`, {
        headers: {
        'aftership-api-key': API_tracking.API_tracking_key,
        'Content-Type': 'application/json',
        }
      })
        .then((res) => {
        console.log('res.data: ', res.data.data.trackings[0].checkpoints);
        this.setState({
            trackingHistory: res.data.data.trackings[0].checkpoints,
            showTracking: true,
        })
        })
        .catch((err) => {
        console.log(err);
        })
    } else {
      this.setState({
        showTracking: true,
      })
    }
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
            <div className="po-detail-modal-top-middle">
              <div className="po-vendor"> {po.vendor_name}</div>
              <div className="po-number">PO Number:    {po.order_number}</div>
              <div className="po-date">PO Date:    {this.props.formatDate(po.order_issue_date)}</div>
              <div className="po-due-date">Required Shipping Date: {this.props.formatDate(po.required_shipping_date)}</div>
              <div className="po-status">Status:    {po.status}</div>
              <div className="po-tracking">Tracking Number: {this.props.tracking}</div>
            </div>
            <div className="po-detail-modal-top-right">
              <button type="button" onClick={this.toggleMessages}>Messages</button>
              <br />
              <br />
              {/* <button type="button" onClick={() => {this.searchTrackingAPI(this.props.tracking)}}>Tracking</button> */}
              <button type="button" onClick={this.toggleTracking}>Tracking</button>
              <br />
              <br />
              <button type="button" onClick={this.props.toggleModal}>Close</button>
            </div>
          </div>
          {this.state.showMessages && (
            <Note messages={this.state.messages} order_number={this.props.order_number} username={this.props.username}/>
          )}
          {this.state.showTracking && (
            <TrackingHistory trackingHistory={this.state.trackingHistory} tracking={this.props.tracking}/>
          )}
        </div>
      </div>
    )
  }
}

export default SingleOrderModal;