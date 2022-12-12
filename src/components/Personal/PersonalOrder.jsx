import React, { Component } from 'react'
import { Modal, Table, Button, Container, Row, Col, Toast } from 'react-bootstrap'
import io from 'socket.io-client'
import Cookies from 'js-cookie'

import { server_address } from '../../../server.config.js'

import './PersonalOrder.css'

class ViewOrderDetailButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
        this.consumer_socket = this.props.consumer_socket
    }

    componentWillUnmount() {
        this.consumer_socket.disconnect()
    }

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleClose = () => {
        this.setState({ show: false })
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
                    </Modal.Body>
                </Modal>
            </>
        )
    }

}

class ConsumerOrderTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            toast_show: false
        }
        this.consumer_socket = io(server_address + '/consumer', {
            query: { token: Cookies.get('token') }
        })
    }

    componentDidMount() {
        this.consumer_socket.on('order_data', data => {
            console.log(JSON.parse(data))
            this.setState({ datas: JSON.parse(data) })
        })
        this.consumer_socket.on('order_state_change', data => {
            console.log('order_state_change')
            console.log(data)
            this.toastOpenHandler()
        })
    }

    toastOpenHandler = () => {
        this.setState({ toast_show: true })
    }

    toastCloseHandler = () => {
        this.setState({ toast_show: false })
        window.location.reload()
    }


    componentWillUnmount() {
        this.consumer_socket.disconnect()
    }

    render() {
        const tableItems = this.state.datas.map((data, index) => {
            return (
                <tr key={data._id} className="table_item">
                    <td>{index + 1}</td>
                    <td>{data.delivery_state}</td>
                    <td>{data.receive_time}</td>
                    <td>{data.district + " " + data.address}</td>
                    <td>{data.store_name}</td>
                    <td>{data.total_price}</td>
                    <td><ViewOrderDetailButton data={data} consumer_socket={this.consumer_socket} /></td>
                </tr>
            )
        })

        return (
            <>
                <Toast onClose={this.toastCloseHandler} show={this.state.toast_show}>
                    <Toast.Header>
                        <strong className="mr-auto">訂單狀態更新</strong>
                    </Toast.Header>
                    <Toast.Body>已有一筆外送中的訂單抵達囉</Toast.Body>
                </Toast>
                <Table striped bordered hover className="main_table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>運送狀態</th>
                            <th>指定送達時間</th>
                            <th>送達地址</th>
                            <th>店家名稱</th>
                            <th>總金額</th>
                            <th>訂單詳情</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableItems}
                    </tbody>
                </Table>
            </>
        )
    }
}

export default ConsumerOrderTable