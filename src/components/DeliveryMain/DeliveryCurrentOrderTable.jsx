import React, { Component } from 'react'
import { Modal, Table, Button, Container, Row, Col, ButtonToolbar } from 'react-bootstrap'
import io from 'socket.io-client'
import Cookies from 'js-cookie'

import { server_address, GEO, STORE_SEARCH } from '../../../server.config.js'

import './DeliveryOrderTable.css'

class ViewOrderDetailButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            rest_navigation: '',
            dest_navigation: ''
        }
        this.delivery_socket = this.props.delivery_socket
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const data = this.props.data
                const origin_location = position.coords.latitude + ',' + position.coords.longitude
                // GET DESTINATION NAVAGATION URL
                const dest_address = data.district + data.address
                fetch(GEO, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        address: dest_address
                    })
                })
                .then(res => res.json()) // res = {lat: 25.15044, lng: 121.7755731}
                .then(res => {
                    const dest_location = res.lat + ',' + res.lng
                    this.setState({ 
                        dest_navigation : `https://www.google.com/maps/dir/${origin_location}/${dest_location}`
                    })
                })

                // GET RESTAURANT NAVAGATION URL
                fetch(STORE_SEARCH, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: data.store_id
                    })
                })
                .then(res => res.json())
                .then(res => {
                    const rest_address = res[0].district + res[0].address
                    fetch(GEO, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            address: rest_address
                        })
                    })
                    .then(res => res.json()) // res = {lat: 25.15044, lng: 121.7755731}
                    .then(res => {
                        const rest_location = res.lat + ',' + res.lng
                        this.setState({ 
                            rest_navigation : `https://www.google.com/maps/dir/${origin_location}/${rest_location}`
                        })
                    })
                })
                
            })

        } else
            alert('geolocation IS NOT available')
    }

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleClose = () => {
        this.setState({ show: false })
    }

    handleStateUpdate = (order_id) => {
        this.delivery_socket.emit('delivery_state_update', order_id)
        this.handleClose()
        window.location.reload()
    }

    render() {
        const data = this.props.data
        const tableItems = data.foods.map((food, index) => {
            return (
                <tr key={index} className="order_detail_table_item">
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
                            <hr />
                            <Button variant="secondary" onClick={() => this.handleStateUpdate(data._id)}>變更狀態</Button>
                            <hr />
                            <ButtonToolbar>
                                <Button variant="secondary" href={this.state.dest_navigation}>導航至外送地</Button>
                                &nbsp;
                                <Button variant="secondary" href={this.state.rest_navigation}>導航至店家</Button>
                            </ButtonToolbar>
                        </Container>
                    </Modal.Body>
                </Modal>
            </>
        )
    }

}

class DeliveryCurrentOrderTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: []
        }
        this.delivery_socket = io(server_address + '/delivery_man_current', {
            query: { token: Cookies.get('token') }
        })
    }

    componentDidMount() {
        this.delivery_socket.on('order_data', data => {
            console.log(data)
            this.setState({ datas: JSON.parse(data) })
        })
        this.delivery_socket.on('delivery_state_update', data => {
            console.log(data)
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
                    <td>{data.delivery_state}</td>
                    <td>{data.store_state}</td>
                    <td>
                        <ViewOrderDetailButton key={index} data={data} 
                            delivery_socket={this.delivery_socket} />
                    </td>
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
                        <th>外送狀態</th>
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

export default DeliveryCurrentOrderTable