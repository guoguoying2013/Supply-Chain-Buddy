import React, { useEffect, useState } from 'react';
import LoginForm from './LoginForm.jsx';
import Dashboard from './Dashboard.jsx';
import SignUpForm from './SignUpForm.jsx';

const App = () => {
  const [isLogin, toggleLogin] = useState(false);
  const [signinFormShow, toggleSingForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState(null);
  const [showDashBoard, toggleDashBoard] = useState(false);
  const [signUpForm, toggleSignUpForm] = useState(false);

  const toggleSigninModal = (uId) => {
    if (signinFormShow) {
      toggleSingForm(false);
      if (uId) {
        toggleLogin(true);
        setUserId(uId);
        toggleDashBoard(true);
      }
    } else {
      toggleSingForm(true);
    }
  };

  return (
    <div>
      <div className="nav">
        <i id="logo" className="far fa-lightbulb" />
        <span id="supply-chain">SupplyChain</span>
        <span id="buddy">Buddy</span>
        <button onClick={toggleSignUpForm} type="button">Sign Up</button>
        {!isLogin && (
          <button onClick={toggleSigninModal} type="button">Login</button>
        )}
        {isLogin && (
          <button onClick={() => { toggleLogin(false); toggleDashBoard(false); }} type="button">Logout</button>
        )}
      </div>
      <LoginForm
        show={signinFormShow}
        closeModal={toggleSigninModal}
        passUsername={setUsername}
      />
      {signUpForm
            && (
            <SignUpForm />
            )}
      <div className="dashboard">
        {showDashBoard && (
          <Dashboard
            userId={userId}
            username={username}
          />
        )}
      </div>
      {!isLogin && (
        <div>
          <div className="first-page-logo">
            <i id="logo" className="far fa-lightbulb" />
            <span id="supply-chain">SupplyChain</span>
            <span id="buddy">Buddy</span>
          </div>
          <img id="first-page" src="./backgroundFinal.png" alt="Homepage background" />
        </div>
      )}
    </div>
  );
};

export default App;
