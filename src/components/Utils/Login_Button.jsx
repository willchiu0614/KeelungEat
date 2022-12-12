import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Modal, Form, Col } from 'react-bootstrap'
import Cookies from 'js-cookie'

import { LOGIN, AUTH, REGISTER, CHECK } from '../../../server.config.js'

import './Login_Button.css'

class Signup_Button extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            name: "",
            email: "",
            password: "",
            district: "",
            address: "",
            tel: ""
        }
    }

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleClose = () => {
        this.setState({ show: false })
    }

    handleSubmit = () => {
        console.log('handleSubmit calling')
        console.log({
            "name": this.state.name,
            "email": this.state.email,
            "password": this.state.password,
            "district": this.state.district,
            "address": this.state.address,
            "identity": "1",
            "status": "0",
            "tel": this.state.tel
        })
        fetch(REGISTER, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "name": this.state.name,
                "email": this.state.email,
                "password": this.state.password,
                "district": this.state.district,
                "address": this.state.address,
                "identity": "1",
                "status": "0",
                "tel": this.state.tel
            })
        })
        .then(() => this.handleClose())
    }

    form_change_handler = (evt) => {
        switch (evt.target.id) {
            case "email":
                this.setState({ email: evt.target.value })
                break
            case "name":
                this.setState({ name: evt.target.value })
                break
            case "district":
                this.setState({ district: evt.target.value })
                break
            case "address":
                this.setState({ address: evt.target.value })
                break
            case "tel":
                this.setState({ tel: evt.target.value })
                break
            case "password":
                this.setState({ password: evt.target.value })
                break
        }
    }

    render() {
        return (
            <>
                <Button className="signup_button"
                    variant="outline-secondary"
                    onClick={this.handleOpen}>
                    Sign up
                </Button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sign up</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onChange={this.form_change_handler} className="signup_form">
                            <Form.Row>
                                <Form.Group as={Col} controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control placeholder={this.state.email} />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control placeholder={this.state.password} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="name">
                                    <Form.Label>姓名</Form.Label>
                                    <Form.Control placeholder={this.state.name} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="district">
                                    <Form.Label>行政區</Form.Label>
                                    <Form.Control placeholder={this.state.district} />
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="address">
                                <Form.Label>地址</Form.Label>
                                <Form.Control placeholder={this.state.address} />
                            </Form.Group>

                            <Form.Group controlId="tel">
                                <Form.Label>電話</Form.Label>
                                <Form.Control placeholder={this.state.tel} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="inner_signup_button"
                            variant="outline-secondary" 
                            onClick={this.handleSubmit}> submit </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

class Login_Button extends Component {
    constructor(props) {
        super(props)

        this.state = {
            show: false,
            email: 'Enter email',
            password: 'Password',
            identity: 0,
            hasLogin: false,
            singout_backto_root: false
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
            if(res == true) 
                this.setState({ hasLogin: true })
        })
    }

    handleClose = () => {
        this.setState({ show: false })
    }

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleSignup = () => {
        console.log('Sinup handler trigger')
    }

    handleLogin = () => {
        fetch(LOGIN, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                "email": this.state.email,
                "password": this.state.password
            })
        })
        .then(res => {
            if (res.status == 401)
                alert('wrong email or password')
            else {
                fetch(AUTH, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(res => {
                    this.setState({ identity: res[0].identity, hasLogin: true })
                })
                .then(() => this.handleClose())
                .then(() => this.forceUpdate())
            }
        })
    }

    emailChangeHandler = (evt) => {
        this.setState({ email: evt.target.value })
    }

    passwordChangeHandler = (evt) => {
        this.setState({ password: evt.target.value })
    }

    handleSignout = () => {
        Cookies.remove('token')
        Cookies.remove('session')
        this.setState({ hasLogin: false, singout_backto_root: true })
    }

    render() {
        const LButton = this.state.hasLogin === false 
        ? <Button variant="outline-info" onClick={this.handleOpen} className="login_button"> 登入 </Button>
        : <Button variant="outline-info" onClick={this.handleSignout} className="login_button"> 登出 </Button>

        if(this.state.singout_backto_root == true)
            return <Redirect to="/" />
        else if(this.state.identity == 1)
            return <Redirect to="/Delivery" />
        else if(this.state.identity == 2)
            return <Redirect to="/RestaurantMain" />
        else if(this.state.identity == 4)
            return <Redirect to="/Admin" />
        return (
            <>
                {LButton}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="address_and_password_form">
                            <Form.Group>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder={this.state.email}
                                    onChange={this.emailChangeHandler} />
                                <Form.Text className="text-muted">
                                    example: kishow01@gmail.com
                                </Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder={this.state.password}
                                    onChange={this.passwordChangeHandler} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Signup_Button />
                        <Button className="inner_login_button"
                            variant="outline-secondary" 
                            onClick={this.handleLogin}> Log in </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default Login_Button