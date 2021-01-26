/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserProfileBox from './UserProfileBox.jsx';
import PurchaseOrder from './PurchaseOrder.jsx';
import EnterNewOrderModal from './EnterNewOrderModal.jsx';
import SuppliersEvaluation from './SuppliersEvaluation.jsx';
import CustomersReview from './CustomersReview.jsx';

const Dashboard = ({ userId, username }) => {
  const [customer_orders, setCOs] = useState([]);
  const [purchase_orders, setPOs] = useState([]);
  const [newOrderForm, toggleNewOrderForm] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showOrders, toggleShowOrdrs] = useState(true);
  const [showSuppliers, toggleShowSuppliers] = useState(false);
  const [showCustomers, toggleShowCustomers] = useState(false);
  const [suppliers_obj, setSuppliers_obj] = useState([]);
  const [customers_obj, setCustomers_obj] = useState([]);

  const fetchOrders = () => {
    axios.get('/api/orders', {
      params: {
        user_id: userId,
      },
    })
      .then((res) => {
        setPOs(res.data.purchase_orders);
        setCOs(res.data.customer_orders);
      })
      .catch((err) => {
        console.log('fetchOrder got err: ', err);
      });
  };

  const fetchPartners = () => {
    axios.get('/api/partners', {
      params: {
        user_id: userId,
      },
    })
      .then((res) => {
        const customersContainer = [];
        const suppliersContainer = [];
        res.data.customers.map((customer) => {
          customersContainer.push([customer.customer_company, customer.customer_id]);
        });
        res.data.suppliers.map((supplier) => {
          suppliersContainer.push([supplier.vendor_company, supplier.vendor_id]);
        });
        setSuppliers(suppliersContainer);
        setCustomers(customersContainer);
        setSuppliers_obj(res.data.suppliers);
        setCustomers_obj(res.data.customers);
      })
      .catch((err) => {
        console.log('fetchPartners got err: ', err);
      });
  };

  const handleShowOrders = (e) => {
    e.preventDefault();
    toggleShowOrdrs(true);
    toggleShowSuppliers(false);
    toggleShowCustomers(false);
  };

  const handleShowSuppliers = (e) => {
    e.preventDefault();
    toggleShowOrdrs(false);
    toggleShowSuppliers(true);
    toggleShowCustomers(false);
  };

  const handleShowCustomers = (e) => {
    e.preventDefault();
    toggleShowOrdrs(false);
    toggleShowSuppliers(false);
    toggleShowCustomers(true);
  };

  const handleAddNewOrder = (e) => {
    e.preventDefault();
    if (newOrderForm) {
      toggleNewOrderForm(false);
      fetchOrders();
    } else {
      toggleNewOrderForm(true);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPartners();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashbaord-left">
        <div className="user-info">
          <UserProfileBox userId={userId} />
        </div>
        <div className="navigation-bar-left">
          <button className="button-left-nav-bar" onClick={handleShowOrders} type="button">Orders</button>
          <button className="button-left-nav-bar" onClick={handleShowSuppliers} type="button">Suppliers</button>
          <button className="button-left-nav-bar" onClick={handleShowCustomers} type="button">Customers</button>
        </div>
      </div>
      <div className="dashbaord-right">

        {showSuppliers && (
          <SuppliersEvaluation
            suppliers={suppliers}
            suppliers_obj={suppliers_obj}
          />
        )}

        {showCustomers && (
          <CustomersReview
            customers={customers}
            customers_obj={customers_obj}
          />
        )}

        {showOrders && (
          <div className="orders">
            <div className="section">Purchase Orders</div>
            <div className="purchase-orders">
              <div className="add-new-box" onClick={handleAddNewOrder}>
                <i className="fas fa-plus-circle" />
              </div>
              {purchase_orders.length !== 0 && (
                purchase_orders.map((po) => (
                  <div key={po._id}>
                    <PurchaseOrder po={po} username={username} />
                  </div>
                ))
              )}
            </div>
            <div className="section">Customer Orders</div>
            <div className="purchase-orders">
              <div className="add-new-box" onClick={handleAddNewOrder}>
                <i className="fas fa-plus-circle" />
              </div>
              {customer_orders.length !== 0 && (
                customer_orders.map((co) => (<PurchaseOrder po={co} username={username} />))
              )}
            </div>
          </div>
        )}

        {newOrderForm && (
        <EnterNewOrderModal
          customers={customers}
          suppliers={suppliers}
          user_id={userId}
          username={username}
          suppliers_obj={suppliers_obj}
          customers_obj={customers_obj}
          toggleForm={handleAddNewOrder}
        />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
