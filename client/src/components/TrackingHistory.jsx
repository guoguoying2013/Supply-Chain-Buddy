import React from 'react';

class TrackingHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="tracking-history">
        {this.props.trackingHistory.reverse().map((t) => {
          return(
            <div className="tracking-history-single-point">
              <i className="far fa-clock">&nbsp;</i>
              <span> {t.checkpoint_time.slice(0, 10)} &nbsp;&nbsp;</span>
              <i className="fas fa-truck">&nbsp;</i>
              <span> {t.location}</span>
              <br />
              <span className="tracking-history-status"> {t.message}</span>
              <br />
            </div>
          )
        })}
      </div>
    )
  }
}

export default TrackingHistory;