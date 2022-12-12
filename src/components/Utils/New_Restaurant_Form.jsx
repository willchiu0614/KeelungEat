import React, { Component } from 'react'
import { Container, Col, Button, Image, Form, Table } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

import { ADMIN_CREATE_RESTAURANT } from '../../../server.config.js'

import './New_Restaurant_Form.css'

class New_Food_Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "test_name",
            type: "test_type",
            price: "test_price",
            info: "test_info"
        }
    }

    form_change_handler = (evt) => {
        switch (evt.target.id) {
            case "name":
                this.setState({ name: evt.target.value })
                break
            case "type":
                this.setState({ type: evt.target.value })
                break
            case "price":
                this.setState({ price: evt.target.value })
                break
            case "info":
                this.setState({ info: evt.target.value })
        }
    }

    submitHandler = (evt) => {
        evt.preventDefault()
        this.props.addItemToFoods(this.state.name, this.state.price, this.state.type)
    }

    render() {
        return (
            <Form onSubmit={this.submitHandler} onChange={this.form_change_handler}>
                <Form.Row>
                    <Form.Group as={Col} md="2" controlId="name">
                        <Form.Label>餐點名稱</Form.Label>
                        <Form.Control required type="text" placeholder={this.state.name} />
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="type">
                        <Form.Label>餐點類型</Form.Label>
                        <Form.Control required type="text" placeholder={this.state.type} />
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="price">
                        <Form.Label>餐點價錢</Form.Label>
                        <Form.Control required type="text" placeholder={this.state.price} />
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="info">
                        <Form.Label>Info</Form.Label>
                        <Form.Control required type="text" placeholder={this.state.info} />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Button type="submit" variant="secondary" >新增餐點</Button>
                </Form.Row>

            </Form>
        )
    }
}

class Current_Food_Table extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const foodItems = this.props.foods.map((data, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.price}</td>
                    <td>{data.type}</td>
                    <td>
                        <Button variant="secondary" onClick={() => this.props.deleteItemFromFoods(index)}>刪除</Button>
                    </td>
                </tr>
            )
        })
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>名稱</th>
                        <th>價錢</th>
                        <th>類型</th>
                        <th>刪除</th>
                    </tr>
                </thead>
                <tbody>
                    {foodItems}
                </tbody>
            </Table>
        )
    }
}

class New_Restaurant_Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bind_email: '',
            name: '',
            district: '',
            address: '',
            tel: '',
            info: '',
            foods: [],
            redirect: false
        }
    }

    deleteItemFromFoods = (index) => {
        const foods = this.state.foods
        foods.splice(index, 1)
        this.setState({ foods: foods })
    }

    addItemToFoods = (name, price, type) => {
        const food = [{ 
            name: name, 
            price: price, 
            type: type,
            image_url: null
        }]
        let foods = this.state.foods.concat(food)
        this.setState({ foods: foods })
    }

    form_change_handler = (evt) => {
        switch (evt.target.id) {
            case "bind_email":
                this.setState({ bind_email: evt.target.value })
                break
            case "name":
                this.setState({ name: evt.target.value })
                break
            case "district":
                console.log(evt.target.value)
                this.setState({ district: evt.target.value })
                break
            case "address":
                this.setState({ address: evt.target.value })
                break
            case "tel":
                this.setState({ tel: evt.target.value })
                break
            case "info":
                this.setState({ info: evt.target.value })
                break
        }
    }


    upload_new_data = () => {
        fetch(ADMIN_CREATE_RESTAURANT, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": this.state.bind_email,
                "name": this.state.name,
                "district": this.state.district,
                "address": this.state.address,
                "tel": this.state.tel,
                "info": this.state.info,
                "foods": this.state.foods
            })
        }).then(() => {
            console.log('back to admin page')
            this.setState({ redirect: true })
        })
    }

    render() {
        if(this.state.redirect)
            return <Redirect to="/admin" />
        else
        return (
            <>
                
                <Container >
                
                    <Form onChange={this.form_change_handler} className="new_bg">
                    
                        <Form.Row  >
                         
                            <div className=" row w-100" >
                                <div className="col " >
                                     <div className="d-block " >
                                        <Form.Group as={Col} md="12" controlId="bind_email" className="d-inline-block">
                                            <Form.Label>綁定Email</Form.Label>
                                            <Form.Control placeholder={this.state.bind_email} />
                                        </Form.Group>
                                         </div>
                                         <div className="d-block " >
                                        <Form.Group as={Col} md="6" controlId="name" className="d-inline-block">
                                            <Form.Label>餐廳名稱</Form.Label>
                                            <Form.Control placeholder={this.state.name} />
                                        </Form.Group>
                                        <Form.Group as={Col} md="6" controlId="tel" className="d-inline-block">
                                            <Form.Label>電話</Form.Label>
                                            <Form.Control placeholder={this.state.tel} />
                                        </Form.Group>   
                                    </div>
                                     <div className="d-block " >
                                         <Form.Group as={Col} md="4" controlId="district" className="d-inline-block">
                                            <Form.Label>行政區</Form.Label>
                                            <Form.Control as="select">
                                                <option value='七堵區'>七堵區</option>
                                                <option value='暖暖區'>暖暖區</option>
                                                <option value='仁愛區'>仁愛區</option>
                                                <option value='中山區'>中山區</option>
                                                <option value='中正區'>中正區</option>
                                                <option value='安樂區'>安樂區</option>
                                                <option value='信義區'>信義區</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} md="8" controlId="address" className="d-inline-block">
                                            <Form.Label>地址</Form.Label>
                                            <Form.Control placeholder={this.state.address} />
                                        </Form.Group>  
                                    </div>
                                    <div className="d-block " >
                                           
                                    </div>
                                   
                                </div>
                                <div className="col  " >
                                 <div className="d-block " >
                                    
                                         <Form.Group as={Col} md="12"className="mh-100 " controlId="info">
                                            <Form.Label>Info</Form.Label>
                                            <Form.Control  as="textarea" rows="8" placeholder={this.state.info} />
                                        </Form.Group> 
                                    </div>
                                </div>
                            </div>
                        </Form.Row>
                  
                    
                    
                        <Form.Row  className="d-inline-block">
                           
                        </Form.Row>
                

                        <Form.Row>
                            
                           
                        </Form.Row>

                    </Form>
                    <hr />
                    <New_Food_Form addItemToFoods={this.addItemToFoods} />
                    <hr />
                    <Current_Food_Table foods={this.state.foods} deleteItemFromFoods={this.deleteItemFromFoods} />
                    <hr />
                    <Button variant="secondary" onClick={this.upload_new_data}>
                        儲存
                    </Button>
                </Container>
            </>
        )
    }
}

export default New_Restaurant_Form