import React, { Component } from 'react'
import { Button, Table, Modal } from 'react-bootstrap'
import io from 'socket.io-client'
import Cookies from 'js-cookie'


import { server_address } from '../../../server.config.js'

import './Admin_Order_Status_Table.css'


class Admin_Order_Status_Table extends Component {
    constructor(props) {
        super(props)

        this.state = {
            datas: [],
            checkModalShow: false,
            delete_id: null
        }

        this.admin_socket = io(server_address + '/admin', {
            query: { token: Cookies.get('token') }
        })
    }

    componentDidMount() {
        this.admin_socket.on('order_data', (res) => {
            this.setState({ datas: JSON.parse(res) })
        })
    }

    componentWillUnmount() {
        this.admin_socket.disconnect()
    }

    order_delete_handler = () => {
        this.admin_socket.emit('order_delete', this.state.delete_id)
        this.handleCheckModalClose()
        window.location.reload()
    }

    handleCheckModalClose = () => {
        this.setState({ checkModalShow: false })
    }

    handleCheckModalOpen = (event) => {
        this.setState({ checkModalShow: true, delete_id: event.target.value })
    }

    render() {
        const tableItems = this.state.datas.map((data, index) => {
            return (
                <tr key={data._id} className="table_item">
                    <td>{index + 1}</td>
                    <td>{data.receive_time}</td>
                    <td>{data.store_name}</td>
                    <td>{data.district + " " + data.address}</td>
                    <td>{data.total_price}</td>
                    <td>{data.delivery_state}</td>
                    <td>{data.store_state}</td>
                    <td><Button variant="secondary" size="sm" onClick={this.handleCheckModalOpen} value={data._id}>刪除</Button></td>
                </tr>
            )
        });

        return (
            <Table striped bordered hover className="main_table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>指定送達時間</th>
                        <th>餐廳</th>
                        <th>外送地</th>
                        <th>金額</th>
                        <th>外送狀態</th>
                        <th>店家狀態</th>
                        <th>刪除</th>
                    </tr>
                </thead>
                <tbody>
                    {tableItems}
                </tbody>

                <Modal show={this.state.checkModalShow} onHide={this.handleCheckModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>刪除訂單</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button variant="warning" onClick={this.order_delete_handler}>確定刪除?</Button>
                    </Modal.Body>
                </Modal>
            </Table>
        )
    }
}

export default Admin_Order_Status_Table