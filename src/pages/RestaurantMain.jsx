import React, { Component } from 'react'

import './theme.css'

import { AUTH, CHECK } from '../../server.config.js'

import Header from '../components/Header.jsx'
import RestaurantMainOrderTable from '../components/RestaurantMain/RestaurantMainOrderTable.jsx'
import Unauthorized from './Unauthorized.jsx'

class RestaurantMain extends Component {
    constructor(props) {
        super(props)
        this.state = { isRest: false }
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
            if (res == true) {
                fetch(AUTH, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(res => {
                    if (res[0].identity == "2")
                        this.setState({ isRest: true })
                })
            }
        })
    }
    render() {
        if (this.state.isRest == true)
        return (
            <div style={{ height: '90vh' }}>
                <div className="container-fluid container-center">
                    <Header />
                    <hr />
                    <div className="row justify-content-center content-center">
                        <div className="col-8 col-md-8">
                            <h1 style={{ textAlign: "center" }}>店家管理頁面</h1>
                            <RestaurantMainOrderTable />
                        </div>
                    </div>
                </div>
            </div>
        )
        else
        return <Unauthorized />
    }
}

export default RestaurantMain