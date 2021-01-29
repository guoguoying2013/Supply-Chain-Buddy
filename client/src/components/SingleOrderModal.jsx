import axios from 'axios';
import React, { useState } from 'react';
import Note from './Note.jsx';
import TrackingHistory from './TrackingHistory.jsx';

const SingleOrderModal = (
  {
    orderNumber, orderInfo, toggleModal, tracking, formatDate, username,
  },
) => {
  const [messages, setMessages] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  function fetchMessages() {
    console.log('fetchMessages is called');
    axios.get('/api/messages', {
      params: {
        order_number: orderNumber,
      },
    })
      .then((response) => {
        setMessages(response.data);
        if (showMessages) {
          console.log('setTimeout is calling');
          setTimeout(fetchMessages(), 2000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function toggleMessages() {
    if (showMessages) {
      setShowMessages(false);
    } else {
      setShowMessages(true);
      fetchMessages();
    }
  }

  function searchTrackingAPI(trackingId) {
    if (trackingId !== null) {
      axios.get('/api/tracking', {
        params: {
          id: trackingId,
        },
      })
        .then((res) => {
          setTrackingHistory(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setTrackingHistory('not available');
    }
  }

  function toggleTracking() {
    if (showTracking) {
      setShowTracking(false);
    } else {
      setShowTracking(true);
      searchTrackingAPI(orderInfo.tracking);
    }
  }

  let displayTracking = false;
  if (showTracking && trackingHistory) {
    displayTracking = true;
  }
  const po = orderInfo;

  return (
    <div className="single-order-modal">
      <div className="single-order-modal-content">
        <div className="po-detail-modal-top">
          <div className="po-detail-modal-top-left">
            <img className="vendor-img" src={po.vendor_photo_url} alt="vendor-log" />
          </div>
          <div className="po-detail-modal-top-middle">
            <div className="po-vendor">
              {po.vendor_name}
            </div>
            <div className="po-number">
              PO Number:
              {po.order_number}
            </div>
            <div className="po-date">
              PO Date:
              {formatDate(po.order_issue_date)}
            </div>
            <div className="po-due-date">
              Required Shipping Date:
              {formatDate(po.required_shipping_date)}
            </div>
            <div className="po-status">
              Status:
              {po.status}
            </div>
            <div className="po-tracking">
              Tracking Number:
              {tracking}
            </div>
          </div>
          <div className="po-detail-modal-top-right">
            <button type="button" onClick={toggleMessages}>Messages</button>
            <br />
            <br />
            <button type="button" onClick={toggleTracking}>Tracking</button>
            <br />
            <br />
            <button type="button" onClick={toggleModal}>Close</button>
          </div>
        </div>
        {showMessages && (
          <Note messages={messages} orderNumber={orderNumber} username={username} />
        )}
        {displayTracking && (
          <TrackingHistory trackingHistory={trackingHistory} tracking={tracking} />
        )}
      </div>
    </div>
  );
};

// class SingleOrderModal extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       messages: null,
//       trackingHistory: null,
//       showTracking: false,
//       showMessages: false,
//     }
//     this.fetchMessages = this.fetchMessages.bind(this);
//     this.searchTrackingAPI = this.searchTrackingAPI.bind(this);
//     this.toggleMessages = this.toggleMessages.bind(this);
//     this.toggleTracking = this.toggleTracking.bind(this);
//   }

//   fetchMessages() {
//     axios.get('/api/messages', {
//       params: {
//         order_number: this.props.order_number
//       }
//     })
//       .then((response) => {
//         this.setState({
//           messages: response.data,
//         })
//         if(this.state.showMessages) {
//           console.log('setTimeout is calling')
//           setTimeout(this.fetchMessages(), 2000);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//   }

//   toggleMessages() {
//     if(this.state.showMessages) {
//       this.setState({
//           showMessages: false,
//       })
//     } else {
//       this.setState({
//         showMessages: true,
//         })
//       this.fetchMessages();
//     }
//   }

//   toggleTracking() {
//     if(this.state.showTracking) {
//       this.setState({
//       showTracking: false,
//     })
//     } else {
//       this.searchTrackingAPI(this.props.tracking)
//     }
//   }

//   searchTrackingAPI(trackingId) {
//     console.log('trackingId: ', trackingId);
//     console.log('API_tracking_key', APITrackingKey.APITrackingKey);
//     if(trackingId !== 'Not Available') {
//       axios.get(`https://api.aftership.com/v4/trackings?id=${trackingId}`, {
//         headers: {
//         'aftership-api-key': APITrackingKey.APITrackingKey,
//         'Content-Type': 'application/json',
//         }
//       })
//         .then((res) => {
//         this.setState({
//             trackingHistory: res.data.data.trackings[0].checkpoints,
//             showTracking: true,
//         })
//         })
//         .catch((err) => {
//         console.log(err);
//         })
//     } else {
//       this.setState({
//         showTracking: true,
//       })
//     }
//   }

//   render() {
//     let po = this.props.order_info;
//     return(
//       <div className="single-order-modal">
//         <div className="single-order-modal-content">
//           <div className="po-detail-modal-top">
//             <div className="po-detail-modal-top-left">
//               <img className="vendor-img" src={po.vendor_photo_url}></img>
//             </div>
//             <div className="po-detail-modal-top-middle">
//               <div className="po-vendor"> {po.vendor_name}</div>
//               <div className="po-number">PO Number:    {po.order_number}</div>
//               <div className="po-date">PO Date:    {this.props.formatDate(po.order_issue_date)}</div>
//               <div className="po-due-date">Required Shipping Date: {this.props.formatDate(po.required_shipping_date)}</div>
//               <div className="po-status">Status:    {po.status}</div>
//               <div className="po-tracking">Tracking Number: {this.props.tracking}</div>
//             </div>
//             <div className="po-detail-modal-top-right">
//               <button type="button" onClick={this.toggleMessages}>Messages</button>
//               <br />
//               <br />
//               <button type="button" onClick={this.toggleTracking}>Tracking</button>
//               <br />
//               <br />
//               <button type="button" onClick={this.props.toggleModal}>Close</button>
//             </div>
//           </div>
//           {this.state.showMessages && (
//             <Note messages={this.state.messages} orderNumber={this.props.order_number} username={this.props.username}/>
//           )}
//           {this.state.showTracking && (
//             <TrackingHistory trackingHistory={this.state.trackingHistory} tracking={this.props.tracking}/>
//           )}
//         </div>
//       </div>
//     )
//   }
// }

export default SingleOrderModal;
