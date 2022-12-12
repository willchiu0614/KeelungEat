import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup } from 'react-bootstrap'

import { CHECK, AUTH } from '../../server.config.js'

import './theme.css'

import Header from '../components/Header.jsx'
import Admin_Order_Status_Table from '../components/Admin/Admin_Order_Status_Table.jsx'
import Admin_Restaurant_Table from '../components/Admin/Admin_Restaurant_Table.jsx'
import Admin_User_Table from '../components/Admin/Admin_User_Table.jsx'
import Admin_DeliveryMan_Table from '../components/Admin/Admin_DeliveryMan_Table.jsx'
import Unauthorized from './Unauthorized.jsx'

class Admin_Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show_list_id: 0,
            isAdmin: false
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
                    console.log(res[0])
                    if(res[0].identity == "4")
                        this.setState({isAdmin: true})
                })
            }
        })
    }

    closeNewStoreModal = () => {
        this.setState({ show_new_store_modal: false })
    }

    showAllRestaurant = () => {
        this.setState({ show_list_id: 1 })
    }

    closeNewDeliveryManModal = () => {
        this.setState({ show_new_delivery_man_modal: false })
    }

    showAllUser = () => {
        this.setState({ show_list_id: 2 })
    }

    showAllDeliveryMan = () => {
        this.setState({ show_list_id: 3 })
    }

    showAllOrderStatus = () => {
        this.setState({ show_list_id: 0 })
    }

    render() {
        let table = <Admin_Order_Status_Table />

        if (this.state.show_list_id == 0)
            table = <Admin_Order_Status_Table />
        else if (this.state.show_list_id == 1)
            table = <Admin_Restaurant_Table />
        else if (this.state.show_list_id == 2)
            table = <Admin_User_Table />
        else if (this.state.show_list_id == 3)
            table = <Admin_DeliveryMan_Table />

        if (this.state.isAdmin == true)
            return (
                <>
                    <div>
                        <div className="container-fluid content-center">
                            <Header />
                            <hr />
                            <div className="row  justify-content-center no-gutters">
                                <div className="col-md-2">
                                    <ButtonGroup className="btn_all " vertical size="lg">
                                        <Button variant="outline-secondary" onClick={this.showAllRestaurant}>
                                            所有店家
                                        </Button>
                                        <Button variant="outline-secondary" as={Link} to={{ pathname: `/New_Restaurant` }} >
                                            新增店家
                                        </Button>
                                        <Button variant="outline-secondary" onClick={this.showAllUser}>
                                            所有使用者
                                        </Button>
                                        <Button variant="outline-secondary" onClick={this.showAllDeliveryMan}>
                                            所有外送員
                                        </Button>
                                        <Button variant="outline-secondary" onClick={this.showAllOrderStatus}>
                                            檢視所有訂單
                                        </Button>
                                    </ButtonGroup>
                                </div>
                                <div className="col-md-8">
                                    {table}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        else
            return (
                <Unauthorized />
            )
    }
}

export default Admin_Main