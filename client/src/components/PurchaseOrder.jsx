import React from 'react';
import SingleOrderModal from './SingleOrderModal.jsx'

class PurchaseOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    }
    this.formatDate = this.formatDate.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  formatDate(dateString) {
      var d = new Date(dateString),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [year, month, day].join('-');
  }

  toggleModal(e) {
    e.preventDefault();
    console.log('toggleModal for order detail is clicked');
    if(this.state.showModal) {
      this.setState({
        showModal: false
      });
    } else {
      this.setState({
        showModal: true
      });
    }
  }
  
  render() {
    let tracking = 'Not Available'
    if(this.props.po.tracking) {
      tracking = po.tracking;
    }
    let isOverDue = false;
    let requiredShippingDate = new Date(this.props.po.required_shipping_date)
    let today = new Date();
    if(requiredShippingDate - today < 0) {
      isOverDue = true;
    };

    return (
      <div key={this.props.po.order_number}>
        <div className="single-po-box" onClick={this.toggleModal}>
          <div className="single-po-left">
            <img className="vendor-img" src={this.props.po.vendor_photo_url}></img>
            {isOverDue && (<span className="urgent-clock">&#9200;</span>)}
          </div>
          <div>
            <div className="po-vendor"> {this.props.po.vendor_name}</div>
            <div className="po-number">PO Number:    {this.props.po.order_number}</div>
            <div className="po-date">PO Date:    {this.formatDate(this.props.po.order_issue_date)}</div>
            <div className="po-due-date">Required Shipping Date: {this.formatDate(this.props.po.required_shipping_date)}</div>
            <div className="po-status">Status:    {this.props.po.status}</div>
            <div className="po-tracking">Tracking Number: {tracking}</div>
          </div>
        </div>
        <br />
        {this.state.showModal && (
          <SingleOrderModal
            order_number={this.props.po.order_number}
            order_info={this.props.po}
            toggleModal={this.toggleModal}
            isOverDue={isOverDue}
            tracking={tracking}
            formatDate={this.formatDate}
          />
        )}
      </div>
    )
  }
}

/*
customer_id: 1
documents: null
order_issue_date: "Sat Dec 26 2020 11:53:50 GMT-0800 (Pacific Standard Time)"
order_number: 1
required_shipping_date: "Wed Dec 30 2020 11:53:50 GMT-0800 (Pacific Standard Time)"
status: "released_to_production"
tracking: null
urgency_level: "important"
vendor_id: 2
*/

export default PurchaseOrder;