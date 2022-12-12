import React, { Component } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

import './theme.css'

import { AUTH, CHECK } from '../../server.config.js'

import Header from '../components/Header.jsx'
import DeliveryOrderTable from '../components/DeliveryMain/DeliveryOrderTable.jsx'
import DeliveryCurrentOrderTable from '../components/DeliveryMain/DeliveryCurrentOrderTable.jsx'
import Unauthorized from './Unauthorized.jsx'

import Delivery_Man_State_Button from '../components/Utils/Delivery_Man_State_Button.jsx'

class DeliveryMain extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            show_list_id: 0,
            isDelivery: false 
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
                    if (res[0].identity == "1")
                        this.setState({ isDelivery: true })
                })
            }
        })
    }
    showDeliveryOrderTable = () => {
        this.setState({ show_list_id: 0 })
    }

    showDeliveryCurrentOrderTable = () => {
        this.setState({ show_list_id: 1 })
    }

    render() {
        let table = <DeliveryOrderTable />

        if (this.state.show_list_id == 0)
            table = <DeliveryOrderTable />
        else if (this.state.show_list_id == 1)
            table = <DeliveryCurrentOrderTable />

        if (this.state.isDelivery == true)
            return (
                <div style={{ height: '90vh' }}>
                    <div className="container-fluid container-center">
                        <Header />
                        <hr />
                        <div className="row  justify-content-center no-gutters">
                            <div className="col-md-2">
                                    <ButtonGroup vertical size="lg">
                                        <Button variant="outline-info" onClick={this.showDeliveryOrderTable}>
                                                所有訂單
                                        </Button>
                                        <Button variant="outline-info" onClick={this.showDeliveryCurrentOrderTable}>
                                                目前訂單
                                        </Button>
                                    </ButtonGroup>
                            </div>
                            <div className="col-md-8">
                                <h1 style={{ textAlign: "center" }}>外送員訂單頁面</h1>
                                <Delivery_Man_State_Button />
                                <hr />
                                {table}
                            </div>
                        </div>
                    </div>
                </div>
            )
        else
            return <Unauthorized />
    }
}

export default DeliveryMain