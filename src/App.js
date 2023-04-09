import React, { useState, useEffect } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutPage from './Components/AboutPage';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import LoginPage from './Components/LoginPage';
import Dashboard from './Components/Dashboard';
import loginService from './Services/LoginService';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [user, setUser] = useState(null)
  const notify = () => toast.success('💥 Great, Glad to See here!', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  })
  const loginHandler = async (loginCredentials) => {
    try {
      const userObject = await loginService.login(loginCredentials)
      console.log("User: ", userObject)
      if (userObject) {
        setUser(userObject);
        window.localStorage.setItem('sessionUser', JSON.stringify(userObject));
        notify();
      }
      else {
        alert("Log in failed, check username and password entered")
      }

    }
    catch (exception) {
      alert("Log in failed, check username and password entered")
    }
  }

  useEffect(() => {
    const sessionUser = window.localStorage.getItem('sessionUser')
    if (sessionUser)
      setUser(JSON.parse(sessionUser))
    else
      setUser(null)
  }, [])
  return (
    <BrowserRouter>
      <div>
        <Header user={user} setUser={setUser} />
        {
          (user !== null) && <Navbar />
        }
        <Routes>
          {
            (user === null) && <Route path="/" element={<LoginPage loginHandler={loginHandler} />} />
          }
          {
            (user !== null) && <Route path="/" element={<Dashboard user={user} />} />
          }
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
