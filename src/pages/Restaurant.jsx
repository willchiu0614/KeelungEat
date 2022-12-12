import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Image, Card, Button, Modal, Form } from 'react-bootstrap'

import { CHECK, AUTH } from '../../server.config.js'

import './theme.css'

import Header from '../components/Header.jsx'
import ShoppingCart_Button from '../components/Restaurant/ShoppingCart_Button.jsx'

import sub_image from '../../assets/image/utils/減號.png'
import add_image from '../../assets/image/utils/加號.png'

class Food_Menu_Item extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const image_style = {
            height: "200px",
            width: '18rem'
        }

        return (
            <div className="col-md-4 col-12 text-center">
            
            <Card style={{ width: '18rem', float: 'left', position: 'relative', left: '10%'  }} >
                <Card.Img style={image_style} variant="top" src={this.props.food.image_url} />
                <Card.Body>
                    <Card.Title>{this.props.food.name}</Card.Title>
                    <Card.Text>
                        ${this.props.food.price}
                    </Card.Text>
                    <Card.Text>
                        {this.props.food.info}
                    </Card.Text>
                    <AddToCartButton food={this.props.food} addItemToShoppingCart={this.props.addItemToShoppingCart}/>
                </Card.Body>
            </Card>
            </div>
        )
    }
}

class AddToCartButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            number: 0
        }
    }

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleClose = () => {
        this.setState({ show: false })
    }

    addToCart = () => {
        
        if(this.state.number <= 0) {
            alert("選擇所要加入的數量")
        }
        else {
            this.props.addItemToShoppingCart({
                food_id: this.props.food.id,
                number: this.state.number
            })
            this.handleClose()
        }
    }

    render() {
        const plus_style = {
            width: '30%',
            height: '100%',
            float: 'right'
        }
        const sub_style ={
            width: '30%',
            height: '100%',
            float: 'left'
        }

        return (
            <>
            <Button variant="outline-info" onClick={this.handleOpen}>加入購物車</Button>
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        加入購物車
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-4">
                                <Image style={plus_style} src={add_image} roundedCircle 
                                       onClick={() => this.setState({ number: this.state.number + 1 })}
                                />
                            </div>
                            <div className="col-4">
                                <Form.Control type="text" placeholder={this.state.number} />
                            </div>

                            <div className="col-4">
                                <Image style={sub_style} src={sub_image} roundedCircle 
                                       onClick={() => { 
                                            if(this.state.number > 0)
                                                this.setState({ number: this.state.number - 1 })
                                        }}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-info" onClick={this.addToCart}>加入</Button>
                </Modal.Footer>
            </Modal>
            </>
        )
    }
}

class Restaurant extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shoppingCart: [],
            personal: {}
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
                        name: res[0].name
                    }})
                })
            }
        })
    }

    addItemToShoppingCart = (food) => {
        let spc = this.state.shoppingCart
        for(let i = 0; i < spc.length; i++)
            if(spc[i].food_id == food.food_id) {
                spc[i].number += food.number
                this.setState({ shoppingCart: spc })
                return 
            }
        spc.push(food)
        this.setState({ shoppingCart: spc })
    }

    modifyShoppingCart = (opcode, target_id) => {
        if(opcode == 'delete') {
            let spc = this.state.shoppingCart
            for(let i = spc.length - 1; i >= 0; i--)
                if(spc[i].food_id == target_id)
                    spc.splice(i, 1)
            this.setState({ shoppingCart: spc })
        }
        else if(opcode == 'increase') {
            let spc = this.state.shoppingCart
            for(let i = 0; i < spc.length; i++)
                if(spc[i].food_id == target_id)
                    spc[i].number += 1
            this.setState({ shoppingCart: spc })
        }
        else if(opcode == 'decrease') {
            let spc = this.state.shoppingCart
            for(let i = 0; i < spc.length; i++)
                if(spc[i].food_id == target_id) {
                    if(spc[i].number == 1)
                        spc.splice(i, 1)
                    else
                        spc[i].number -= 1
                }
            this.setState({ shoppingCart: spc })
        }
    }

    render() {
        const rest = this.props.location.state.rest
        console.log(rest)
        const delivery_address = this.props.location.state.delivery_address

        const menu = rest.foods.map((food) => {
            return <Food_Menu_Item key={food.id} rest_name={rest.name} food={food} 
                    addItemToShoppingCart={this.addItemToShoppingCart}/>
        })

        return (
            <div>
                <div className="container-fluid container-center">
                    <Header />
                    <ShoppingCart_Button rest={rest}
                                         foods={rest.foods} 
                                         orders={this.state.shoppingCart} 
                                         modifyShoppingCart={this.modifyShoppingCart}
                                         personal={this.state.personal}
                                         delivery_address={delivery_address} />
                    <br /><br />
                    <div className="row align-items-center justify-content-center no-gutters">
                        <div className="col-8 col-md-8 text-center">
                            <Image src={rest.image_url} fluid thumbnail />
                        </div>
                    </div>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-8 col-md-8">
                            <h3>{rest.name}</h3>
                            <h5>{rest.district}{rest.address}</h5>
                            <hr />
                            <h6>{rest.info}</h6>
                            <hr />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {menu}
                    </div>
                    <hr />
                </div>
            </div>
        )
    }
}

export default withRouter(Restaurant)
