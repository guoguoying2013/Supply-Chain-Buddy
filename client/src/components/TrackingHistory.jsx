import React from 'react';

const TrackingHistory = (props) => {
  if (props.trackingHistory === 'not available') {
    return (
      <div className="tracking-history">
        Tracking info is not available for this order.
      </div>
    );
  }
  return (
    <div className="tracking-history">
      {props.trackingHistory.reverse().map((t) => (
        <div className="tracking-history-single-point">
          <i className="far fa-clock">&nbsp;</i>
          <span>
            {t.checkpoint_time.slice(0, 10)}
            &nbsp;
            &nbsp;
          </span>
          <i className="fas fa-truck">&nbsp;</i>
          <span>
            {t.location}
          </span>
          <br />
          <span className="tracking-history-status">
            {t.message}
          </span>
          <br />
        </div>
      ))}
    </div>
  );
};

export default TrackingHistory;
