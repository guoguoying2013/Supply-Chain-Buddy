import React from 'react';
// import axios from 'axios';
import LoginForm from './LoginForm.jsx';
import Dashboard from './Dashboard.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      signinFormShow: false,
      userId: '',
    }
    this.buttonContent = this.buttonContent.bind(this);
    this.toggleSigninModal = this.toggleSigninModal.bind(this);
  }

//   requireLogin() {
//     // this func will check session/cookie
//     axios.post('/login')
//       .then(response => {
//           console.log('response from /login get request', response);
//       })
//   }

  buttonContent() {
    if(this.state.isLogin) {
      return 'Logout'
    } else if(!this.state.signinFormShow){
      return 'Click to Login'
    } else {
      return 'Login form is open'
    }
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
      // handle log out?
    }
  }

  render() {
    return (
      <div>
        <div className="nav">
          <button onClick={this.toggleSigninModal}>{this.buttonContent()}</button>
        </div>
        <LoginForm 
          requireLogin={this.requireLogin}
          show={this.state.signinFormShow}
          closeModal={this.toggleSigninModal}
        />
        {this.state.isLogin && (
          <Dashboard userId={this.state.userId}/>
        )}
      </div>
    )
  }
}

export default App;