import React, { useState } from 'react'
import './Stylesheets/LoginPage.css'

const LoginPage = ({ loginHandler }) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    if (userName.length > 10 || password.length < 8 || password.length > 32) {
      alert("credentials are not in correct format! username: Max-10 characters, password: Min-8 Max-32 characters")
      setUserName('')
      setPassword('')
      return
    }
    const loginCredentials = {
      userName, password
    }

    loginHandler(loginCredentials)

    // Reset the form state
    setUserName('')
    setPassword('')
  }


  return (
    <div>
      {
        <div className='LoginPage container-fluid'>
          <div className='LoginContainer container-sm bg bg-light'>
            <div className='LoginTitle'>Enter your Credentials</div>
            <div className='LoginForm'>
              <form onSubmit={handleLogin}>
                <label for='login-userid' className='InputLabel1'>User Id.</label>
                <input
                  type='text'
                  placeholder='Enter your User Id. ...'
                  className='InputText'
                  id='login-userid'
                  value={userName}
                  onChange={event => setUserName(event.target.value)}
                  required
                />
                <br />
                <label for='login-userid' className='InputLabel'>Password</label>
                <input
                  type='password'
                  placeholder='Enter your Password ...'
                  className='InputText'
                  id='login-password'
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  required
                />
                <br />
                <button type='submit' className='InputButton btn btn-outline-primary'>Login</button>
              </form>
            </div>
            <div className='LoginMessage'></div>

          </div>
        </div>
      }
    </div>

  )
}

export default LoginPage