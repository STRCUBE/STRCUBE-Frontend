import React, {useEffect} from 'react';
import './Stylesheets/AboutPage.css';
import { useNavigate } from 'react-router-dom';
const AboutPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const sessionUser = window.localStorage.getItem('sessionUser')
    if (!sessionUser)
      navigate('/');

}, []);
  return (
    <div className='AboutPage'>
      <h1 className='AboutTitle'>Welcome to the About Page</h1>
      <p className='AboutContent'>This is Page is under construction.</p>
    </div>
  )
}

export default AboutPage