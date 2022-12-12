import React, { Component } from 'react'

import './theme.css'

import Header from '../components/Header.jsx'
import Address_Input_Group from '../components/Main/Address_Input_Group.jsx'

import { CHECK, AUTH, TEST_COOKIE } from '../../server.config.js'

import Cookies from 'js-cookie'

class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            personal: { 
                hasLogin: false
            }
        }
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
            if(res == true) {
                fetch(AUTH, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(res => {
                    this.setState({ personal: {
                        id: res[0].id,
                        name: res[0].name,
                        identity: res[0].identity,
                        hasLogin: true
                    }})
                })
            }
        })
    }


    render() {
        return (
            <div style={{height: '90vh'}}>
                <div className="container-fluid container-center">
                    <Header />
                    <div className="row align-items-center justify-content-center content-center">
                        <div className="col-8 col-md-6">
                            <h2 style={{color: "LightGray"}}>KeelungEat</h2>
                            <Address_Input_Group personal={this.state.personal} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Main