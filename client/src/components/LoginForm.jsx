import React from 'react';
import axios from 'axios';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.resetState = this.resetState.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  resetState() {
      this.setState({
        username: '',
        password: '',
      })
  }

  handleSubmit(e) {
    e.preventDefault();
    // if password and username got verified, close modal
    let data = {
      username: this.state.username,
      password: this.state.password,
    };
    axios.post('/login', data)
      .then((res) => {
        console.log('axio got response: ', res);
        this.props.closeModal();
        this.resetState();
      })
      .catch((err) => {
        console.log('axios err: ', err);
      })
  }

  render() {
    if(!this.props.show) {
      return null;
    }
    return (
      <div className="LoginModal">
        <form className="modal-content">
          <h1>Login Form</h1>
          <input type="text" value={this.state.username} onChange={this.handleChange} name='username' placeholder="Username" required></input>
          <br />
          <input type="password" value={this.state.password} onChange={this.handleChange} name='password' placeholder="Password" required></input>
          <br />
          <button onClick={this.handleSubmit} className="submit-button">Submit</button>
        </form>
      </div>
    )
  }
}


export default LoginForm;