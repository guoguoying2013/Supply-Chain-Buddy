import React from 'react';
import axios from 'axios';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      username: '',
      password: '',
    }
  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
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
          <label>
            Username
            <input type="text" value={this.state.username} onChange={this.handleChange} name='username'></input>
          </label>
          <br />
          <label>
            Password
            <input type="text" value={this.state.password} onChange={this.handleChange} name='password'></input>
          </label>
          <br />
          <button onClick={this.handleSubmit}>Login</button>
        </form>
      </div>
    )
  }
}


export default LoginForm;