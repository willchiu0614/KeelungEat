import React, { Component } from 'react'

import { Button, Modal, Form, Table, Col } from 'react-bootstrap'
import { AUTH, AUTH_MODIFY } from '../../../server.config.js'

class Modify_Auth_Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.data.id,
            name: this.props.data.name,
            email: this.props.data.email,
            district: this.props.data.district,
            address: this.props.data.address,
            tel: this.props.data.tel,
        }
    }

    changeHandler = (evt) => {
        switch(evt.target.id) {
            case "name":
                this.setState({ name: evt.target.value })
                break
            case "email":
                this.setState({ email: evt.target.value })
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
        }
    }

    upload_new_data = (evt) => {
        evt.preventDefault()
        fetch(AUTH_MODIFY, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: this.state.id,
                name: this.state.name,
                email: this.state.email,
                district: this.state.district,
                address: this.state.address,
                tel: this.state.tel,
            })
        })   
        .then(() => {
            this.props.fetch_data()
        })
    }

    render() {
        return (
            <>
                <Form onChange={this.changeHandler}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="name">
                            <Form.Label>姓名</Form.Label>
                            <Form.Control plcaeholder={this.state.name} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="email">
                            <Form.Label>電子郵件</Form.Label>
                            <Form.Control plcaeholder={this.state.email} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="district">
                            <Form.Label>行政區</Form.Label>
                            <Form.Control placeholder={this.state.district} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="address">
                            <Form.Label>地址</Form.Label>
                            <Form.Control placeholder={this.state.address} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Group as={Col} controlId="tel">
                        <Form.Label>電話</Form.Label>
                        <Form.Control placeholder={this.state.tel} />
                    </Form.Group>
                </Form>
                <Button variant="secondary" size="sm" onClick={this.upload_new_data}>
                    儲存
                </Button>
            </>
        )
    }
}

class Modify_Auth_Button extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleClose = () => {
        this.setState({ show: false })
    }

    render() {
        return (
            <>
                <Button variant="secondary" size="sm" onClick={this.handleOpen}>修改</Button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>修改個人資料</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Modify_Auth_Form 
                            data={this.props.data} 
                            onClose={this} 
                            fetch_data={this.props.fetch_data} />
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

class PersonalDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: []
        }
    }

    componentDidMount() {
        fetch(AUTH, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'
        })
        .then(res => res.json())
        .then(res => {
            this.setState({ datas: res })
        })
    }

    render() {
        const tableItems = this.state.datas.map((data) => {
            console.log(data)
            return (
                <tr key={data.id}>
                    <td>{data.name}</td>
                    <td>{data.email}</td>
                    <td>{data.district}</td>
                    <td>{data.address}</td>
                    <td>{data.tel}</td>
                    <td> <Modify_Auth_Button data={data} fetch_data={this.fetch_data} /> </td>
                </tr>
            )
        })
        return (
            <div >
            <h5>個人資料</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>email</th>
                        <th>地區</th>
                        <th>地區</th>
                        <th>電話</th>
                        <th>修改</th>
                    </tr>
                </thead>
                <tbody>
                    {tableItems}
                </tbody>
            </Table>
            </div>
        )
    }
}

export default PersonalDashboard;