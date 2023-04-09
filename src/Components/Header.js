import React, { useEffect } from 'react'
import './Stylesheets/Header.css'
import logo from '../Images/strcube_logo.png'
import { useNavigate } from 'react-router-dom';
import {FaRegUser} from 'react-icons/fa'
const Header = ({ user, setUser }) => {
    const navigate = useNavigate();
    const logout = () => {
        window.localStorage.removeItem('sessionUser')
        navigate('/');
        setUser(null);
    }
    useEffect(() => {
        const sessionUser = window.localStorage.getItem('sessionUser')
        if (sessionUser)
            setUser(JSON.parse(sessionUser))
        else {
            setUser(null)
            navigate('/');
        }

    }, []);
    return (
        <div className='headerPage shadow-sm p-3 bg-body rounded'>
            {
                (user !== null) &&
                <>
                <button className='headerTextRight btn-primary' onClick={logout}>
                    Logout
                </button>
                <b className='headerTextRight text-success mx-1'><FaRegUser/> &ensp; {user.userId} - {user.firstName} {user.lastName}</b>
                </>
                
            }

            <div className='headerTitle text-primary'><span><img src={logo} alt="logo" width={30} height={30} /></span> STRCUBE - Analytics </div>
        </div>
    )
}

export default Header