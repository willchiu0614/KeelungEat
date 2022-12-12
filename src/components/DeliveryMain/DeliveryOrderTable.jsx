import React, { Component } from 'react'
import { Modal, Table, Button, Container, Row, Col } from 'react-bootstrap'
import io from 'socket.io-client'
import Cookies from 'js-cookie'

import { server_address } from '../../../server.config.js'

import './DeliveryOrderTable.css'

class ViewOrderDetailButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
        this.delivery_socket = this.props.delivery_socket
    }

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleClose = () => {
        this.setState({ show: false })
    }

    acceptOrder = (accept_order_id) => {
        this.delivery_socket.emit('order_accept', accept_order_id, () => {
            window.location.reload()
        })
    }

    render() {
        const data = this.props.data
        const tableItems = data.foods.map((food, index) => {
            return (
                <tr key={data._id} className="order_detail_table_item">
                    <td>{index + 1}</td>
                    <td>{food.name}</td>
                    <td>{food.number}</td>
                </tr>
            )
        })
        return (
            <>
                <Button className="view_order_detail_button"
                    variant="secondary" 
                    size="sm" 
                    onClick={this.handleOpen}> 詳情 </Button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>訂單資訊</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row><h2>訂單內容</h2></Row>
                            <Row>
                                <Col>送達地址: {data.district + " " + data.address}</Col>
                                <Col>送達時間: {data.receive_time}</Col>
                            </Row>
                            <Row>
                                <Col>餐廳: {data.store_name}</Col>
                                <Col>金額: {data.total_price}</Col>
                            </Row>
                            <hr />
                            <Table striped bordered hover className="order_detail_main_table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>餐點名稱</th>
                                        <th>數量</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableItems}
                                </tbody>
                            </Table>
                        </Container>
                        <Button className="accept_order_button"
                            variant="secondary" 
                            onClick={() => { this.acceptOrder(data._id); this.handleClose() }}>
                                接受訂單
                        </Button>
                    </Modal.Body>
                </Modal>
            </>
        )
    }

}

class DeliveryOrderTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: []
        }
        this.delivery_socket = io(server_address + '/delivery_man', {
            query: { token: Cookies.get('token') }
        })
    }

    componentDidMount() {
        this.delivery_socket.on('order_data', data => {
            this.setState({ datas: JSON.parse(data) })
        })
    }

    componentWillUnmount() {
        this.delivery_socket.disconnect()
    }

    render() {
        const tableItems = this.state.datas.map((data, index) => {
            return (
                <tr key={data._id} className="table_item">
                    <td>{index + 1}</td>
                    <td>{data.receive_time}</td>
                    <td>{data.district + " " + data.address}</td>
                    <td>{data.store_name}</td>
                    <td>{data.total_price}</td>
                    <td>{data.store_state}</td>
                    <td><ViewOrderDetailButton data={data} delivery_socket={this.delivery_socket} /></td>
                </tr>
            )
        })

        return (
            <Table striped bordered hover className="main_table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>指定送達時間</th>
                        <th>送達地址</th>
                        <th>店家名稱</th>
                        <th>總金額</th>
                        <th>店家狀態</th>
                        <th>訂單詳情</th>
                    </tr>
                </thead>
                <tbody>
                    {tableItems}
                </tbody>
            </Table>
        )
    }
}

export default DeliveryOrderTable