import React from 'react';
import axios from 'axios';
import LoginForm from './LoginForm.jsx';
import Dashboard from './Dashboard.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      signinFormShow: false,
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

  toggleSigninModal() {
    if(this.state.signinFormShow) {
      this.setState({
        signinFormShow: false,
      });
    } else {
      this.setState({
        signinFormShow: true,
      });
    }
  }

  render() {
    return (
      <div>
        <div className="nav">
          {this.state.isLogin && (<span>Hi username goes here!</span>)}
          <button onClick={this.toggleSigninModal}>{this.buttonContent()}</button>
        </div>
        <LoginForm 
          requireLogin={this.requireLogin}
          show={this.state.signinFormShow}
          closeModal={this.toggleSigninModal}
        />
        {this.isLogin && (
          <Dashboard />
        )}
      </div>
    )
  }
}

export default App;