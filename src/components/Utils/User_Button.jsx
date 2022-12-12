import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './User_Button.css'

import { CHECK } from '../../../server.config.js'

class User_Button extends Component {
    constructor(props) {
        super(props)
        this.state = { hasLogin: false }
    }

    componentDidMount() {
        fetch(CHECK, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => { 
            if(res == true) 
                this.setState({ hasLogin: true })
        })
    }

    render() {
        const LButton = this.state.hasLogin === false
            ? <Button disabled variant="outline-secondary" className="user_button">
                訂單
              </Button> 
            : <Button
                as={Link} 
                to={{ pathname: `/Personal` }} 
                variant="outline-info" 
                className="user_button" >
                    訂單
              </Button> 
        return LButton
    }
}

export default User_Button