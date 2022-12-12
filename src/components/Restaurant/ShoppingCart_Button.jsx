import React, { Component } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker'

import { CONSUMER_CREATE_ORDER, DISTANCE } from '../../../server.config.js'
import './ShoppingCart_Button.css'

import sp_logo from '../../../assets/image/shopping_cart.png'

class ShoppingCart_Button extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show: false,
            service_fee: 0,
            receive_time: new Date(),
            noti_show: false
        }
    }

    componentDidMount() {
        fetch(DISTANCE, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                source : this.props.rest.district + this.props.rest.address,
	            dest: this.props.delivery_address.district + this.props.delivery_address.address 
            })
        })
        .then(res => res.json())
        .then(res => {
            this.setState({ service_fee: res[0].fee })
        })
    }
    

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleClose = () => {
        this.setState({ show: false })
    }

    handleChange = (opcode, target_id) => {
        this.props.modifyShoppingCart(opcode, target_id)
    }

    checkout = () => {
        let subtotal = 0
        this.props.orders.forEach(item => {
            let food = this.props.foods.find(food => item.food_id == food.id)
            subtotal += parseInt(food.price) * parseInt(item.number)
        })

        const y = this.state.receive_time.getFullYear()
        const mou = this.state.receive_time.getMonth() + 1
        const d = this.state.receive_time.getDate()
        const h = this.state.receive_time.getHours()
        const min = this.state.receive_time.getMinutes()
        const s = this.state.receive_time.getSeconds()
        console.log(`${y}-${mou}-${d} ${h}:${min}:${s}`)
        
        fetch(CONSUMER_CREATE_ORDER, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                "receive_time": `${y}-${mou}-${d} ${h}:${min}:${s}`,
                "consumer_id": this.props.personal.id,
                "district": this.props.delivery_address.district,
                "address": this.props.delivery_address.address,
                "store_id": this.props.rest.id,
                "total_price": subtotal + this.state.service_fee,
                "foods": this.props.orders
            })
        })
        .then(() => {
            console.log(`Consumer create order: consumer_id:${this.props.personal.id}, \
                         Delivery address:${this.props.personal.district} ${this.props.personal.address} \
                         Store_id: ${this.props.rest.id} total_price: ${subtotal}`)
            this.handleClose()
            this.setState({ noti_show: true })
        })
    }

    render() {
        const orders = this.props.orders.map((item, index) => {
            let food = this.props.foods.find(food => item.food_id == food.id)
            return (
                <tr key={food.id} className="shopping_cart_table_item">
                    <td>{index}</td>
                    <td>{food.name}</td>
                    <td>{item.number}</td>
                    <td><Button variant="secondary" onClick={() => this.handleChange('increase', food.id)}>增加</Button></td>
                    <td><Button variant="secondary" onClick={() => this.handleChange('decrease', food.id)}>減少</Button></td>
                    <td><Button variant="secondary" onClick={() => this.handleChange('delete', food.id)}>刪除</Button></td>
                </tr>
            )
        })

        let subtotal = 0
        this.props.orders.forEach(item => {
            let food = this.props.foods.find(food => item.food_id == food.id)
            subtotal += parseInt(food.price) * parseInt(item.number)
        })

        return (
            <>
			
                <Button className=" shopping_cart_button "
                    variant="outline-info" 
                    size="lg"
                    onClick={this.handleOpen}>
                     <img
                alt=""
                src={sp_logo}
                
                className="shopping_cart_img "
              />
                </Button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Shopping Cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div>指定送達時間: 
                            <DateTimePicker
                                    onChange={date => this.setState({ receive_time: date })}
                                    value={this.state.receive_time} />
                            </div>
                            <Table striped bordered hover className="shopping_cart_table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>食物名稱</th>
                                        <th>數量</th>
                                        <th>增加</th>
                                        <th>減少</th>
                                        <th>刪除</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders}
                                </tbody>
                            </Table>
                            <div className='row'>
                                <div className="col">
                                    Subtotal: {subtotal}
                                </div>
                                <div className="col">
                                    Service fee: {this.state.service_fee}
                                </div>
                                <div className="col">
                                    Total: { subtotal + this.state.service_fee}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            className="checkout_button"
                            variant="outline-secondary" 
                            onClick={this.checkout}> Check out </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.noti_show} onHide={() => this.setState({noti_show: false})}>
                    <Modal.Header>
                        <Modal.Title>通知</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        成功送出訂單
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default ShoppingCart_Button