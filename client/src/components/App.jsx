import React from 'react';
// import axios from 'axios';
import LoginForm from './LoginForm.jsx';
import Dashboard from './Dashboard.jsx';
import UserProfileBox from './UserProfileBox.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      signinFormShow: false,
      userId: '',
      username: null,
      showSuppliersState: false,
    }
    this.toggleSigninModal = this.toggleSigninModal.bind(this);
    this.passUsername = this.passUsername.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleSigninModal(userId) {
    if(this.state.signinFormShow) {
      this.setState({
        signinFormShow: false,
      });
      if(userId) {
        console.log('received userId: ', userId, 'updating state')
        this.setState({
          isLogin: true,
          userId: userId,
        })
      }
    } else {
      this.setState({
        signinFormShow: true,
      });
    }
  }

  logout() {
    this.setState({
      isLogin: false,
    })
  }

  passUsername(u) {
    this.setState({
      username: u
    })
  }

  render() {
    return (
      <div>
        <div className="nav">
          <i id="logo" class="far fa-lightbulb"></i>
          <span id="supply-chain">SupplyChain</span>
          <span id="buddy">Buddy</span>
          {!this.state.isLogin && (
            <button onClick={this.toggleSigninModal}>Login</button>
          )}
          {this.state.isLogin && (
            <button onClick={this.logout}>Logout</button>
          )}
        </div>
        <LoginForm 
          show={this.state.signinFormShow}
          closeModal={this.toggleSigninModal}
          passUsername={this.passUsername}
        />
        <div className="dashboard">
          {this.state.isLogin && (
            <Dashboard
              userId={this.state.userId}
              username={this.state.username}
            />
          )}
          {!this.state.isLogin && (
            <div>
              <div className="first-page-logo">
                <i id="logo" class="far fa-lightbulb"></i>
                <span id="supply-chain">SupplyChain</span>
                <span id="buddy">Buddy</span>
              </div>
              <img id="first-page" src='./backgroundFinal.png'/>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default App;