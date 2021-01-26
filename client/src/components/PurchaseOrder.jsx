/* eslint-disable prefer-template */
import React, { useState } from 'react';
import SingleOrderModal from './SingleOrderModal.jsx';

const PurchaseOrder = ({ po, username }) => {
  const [showModal, toggleShowModal] = useState(false);

  const toggleModal = (e) => {
    e.preventDefault();
    showModal ? toggleShowModal(false) : toggleShowModal(true);
  };

  function formatDate(dateString) {
    const d = new Date(dateString);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    const time = d.toTimeString().slice(0, 8);
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-') + ', ' + time;
  }

  const tracking = po.tracking ? (<i className="fas fa-check" id="green-checkmark" />) : 'Not Available';
  const requiredShippingDate = new Date(po.required_shipping_date);
  const today = new Date();
  const isOverDue = requiredShippingDate - today < 0;

  return (
    <div>
      <div className="single-po-box" onClick={toggleModal}>
        <div className="single-po-left">
          <img className="vendor-img" src={po.vendor_photo_url} alt="vendor-logo" />
          {isOverDue && (<span className="urgent-clock">&#9200;</span>)}
        </div>
        <div>
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
          <div className="po-due-date">Required Shipping Date: </div>
          <div>{formatDate(po.required_shipping_date)}</div>
          <div className="po-status">
            Status:
            {po.status}
          </div>
          <div className="po-tracking">
            Tracking Number:
            {tracking}
          </div>
        </div>
      </div>
      <br />
      {showModal && (
        <SingleOrderModal
          order_number={po.order_number}
          order_info={po}
          toggleModal={toggleModal}
          isOverDue={isOverDue}
          tracking={tracking}
          formatDate={formatDate}
          username={username}
        />
      )}
    </div>
  );
};

// class PurchaseOrder extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showModal: false,
//     }
//     this.formatDate = this.formatDate.bind(this);
//     this.toggleModal = this.toggleModal.bind(this);
//   }

//   formatDate(dateString) {
//       var d = new Date(dateString),
//           month = '' + (d.getMonth() + 1),
//           day = '' + d.getDate(),
//           year = d.getFullYear();
  
//       if (month.length < 2) 
//           month = '0' + month;
//       if (day.length < 2) 
//           day = '0' + day;
  
//       return [year, month, day].join('-');
//   }

//   toggleModal(e) {
//     e.preventDefault();
//     if(this.state.showModal) {
//       this.setState({
//         showModal: false
//       });
//     } else {
//       this.setState({
//         showModal: true
//       });
//     }
//   }
  
//   render() {
//     let tracking = 'Not Available'
//     if(this.props.po.tracking) {
//       tracking = (<i className="fas fa-check" id="green-checkmark"></i>);
//     }
//     let isOverDue = false;
//     let requiredShippingDate = new Date(this.props.po.required_shipping_date)
//     let today = new Date();
//     if(requiredShippingDate - today < 0) {
//       isOverDue = true;
//     };

//     return (
//       <div>
//         <div className="single-po-box" onClick={this.toggleModal}>
//           <div className="single-po-left">
//             <img className="vendor-img" src={this.props.po.vendor_photo_url}></img>
//             {isOverDue && (<span className="urgent-clock">&#9200;</span>)}
//           </div>
//           <div>
//             <div className="po-vendor"> {this.props.po.vendor_name}</div>
//             <div className="po-number">PO Number:    {this.props.po.order_number}</div>
//             <div className="po-date">PO Date:    {this.formatDate(this.props.po.order_issue_date)}</div>
//             <div className="po-due-date">Required Shipping Date: </div>
//             <div>{this.formatDate(this.props.po.required_shipping_date)}</div>
//             <div className="po-status">Status:    {this.props.po.status}</div>
//             <div className="po-tracking">Tracking Number: {tracking}</div>
//           </div>
//         </div>
//         <br />
//         {this.state.showModal && (
//           <SingleOrderModal
//             order_number={this.props.po.order_number}
//             order_info={this.props.po}
//             toggleModal={this.toggleModal}
//             isOverDue={isOverDue}
//             tracking={tracking}
//             formatDate={this.formatDate}
//             username={this.props.username}
//           />
//         )}
//       </div>
//     )
//   }
// }

export default PurchaseOrder;
