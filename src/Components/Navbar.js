import React, {useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Stylesheets/Navbar.css'
const Navbar = () => {
  const location = useLocation();
  useEffect(() => {
  
  }, [location.pathname]);
  return (
    <nav className='navbar'>
      <ul className='navul'>
        <li className={window.location.pathname === "/" ? "active-li" : ""}>
          <Link to="/" className={window.location.pathname === "/" ? "active-link" : ""}>Home</Link>
        </li>
        <li className={window.location.pathname === "/" ? "active-li" : ""}>
          <Link to="/analytics" className={window.location.pathname === "/analytics" ? "active-link" : ""}>Log Analytics</Link>
        </li>
        <li className={window.location.pathname === "/" ? "active-li" : ""}>
          <Link to="/about" className={window.location.pathname === "/about" ? "active-link" : ""}>About Us</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar