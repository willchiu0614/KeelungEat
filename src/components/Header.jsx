import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import './Header.css'

import User_Button from './Utils/User_Button.jsx'
import Login_Button from './Utils/Login_Button.jsx'

import logo from "../../assets/image/KE.png"

const Header = () => {
    return (
        <>
        
        <Navbar variant="light" className="navbar">
            <Navbar.Brand href="/">
              <img
                alt=""
                src={logo}
                
                className="logo_img  "
              />{' '}
          <span className="logo_text">KeelungEat</span>
        </Navbar.Brand >
            <div className="col-3 col-md-9"></div>
            <Nav className="  header_button1">
                    <User_Button />
            </Nav>
            <Nav className="  header_button2">
                    <Login_Button />
            </Nav> 
        </Navbar> 
        
        </>
 
       
    )
}

export default Header