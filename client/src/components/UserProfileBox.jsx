import React from 'react';
import axios from 'axios';

class UserProfileBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
    };
    this.fetchUser = this.fetchUser.bind(this);
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser() {
    axios.get('/user', {
      params: {
        user_id: this.props.userId
      }
    })
      .then((response) => {
        this.setState({
          userInfo: response.data[0]
        })
        console.log('this.state.userInfo: ', this.state.userInfo);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  render() {
    return(
      <div className='user-profile-box'>
        {this.state.userInfo && (
          <div>
            <img className="your-img" src={this.state.userInfo.photo_url}></img>
            <h3 className="your-company">{this.state.userInfo.company_name}</h3>
            <span className="greeting">Hello, {this.state.userInfo.username}!</span>
          </div>
        )}
      </div>
    )
  }
}

export default UserProfileBox;