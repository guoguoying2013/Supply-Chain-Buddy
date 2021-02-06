import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const SignUpForm = ({ closeModal }) => {
  const { register, handleSubmit, errors, watch } = useForm();
  const password = useRef({});
  password.current = watch('password', '');
  const onSubmit = (data) => {
    console.log(data);
    let newUser = { ...data };
    delete newUser.passwordRepeat;
    console.log(newUser);
    axios.post('/auth/signup', newUser)
      .then((res) => {
        console.log('res at sign up form', res);
      })
      .then(() => {
        closeModal();
      })
      .catch((err) => {
        console.log('err at sign up form: ', err);
      });
  };

  return (
    <div className="signUpModal">
      <form className="modal-content-sign-up" onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign Up Form</h1>
        <input type="text" name="username" placeholder="Username" ref={register({ required: true })} />
        {errors.username && errors.username.type === 'required' && <p>Username is required</p>}
        <br />
        <input type="text" name="company_name" placeholder="Company Name" ref={register({ required: true })} />
        {errors.company_name && <p>Company name is required</p>}
        <br />
        <input type="password" name="password" placeholder="Password" ref={register({ required: true })} />
        {errors.password && <p>Password is required</p>}
        <br />
        <input
          type="password"
          name="passwordRepeat"
          placeholder="Re-enter Password"
          ref={register({
            validate: (value) => value === password.current || 'The passwords do not match',
          })}
        />
        {errors.passwordRepeat && <p>{errors.passwordRepeat.message}</p>}
        <br />
        <input type="text" name="email" placeholder="Email" ref={register({ required: true })} />
        <br />
        <button className="submit-button" name="signUp" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
