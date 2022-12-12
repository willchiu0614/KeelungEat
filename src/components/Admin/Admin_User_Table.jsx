import React, { Component } from 'react'
import { Button, Modal, Form, Table, Col } from 'react-bootstrap'

import { ADMIN_MODIFY_USER, ADMIN_DELETE_USER, ADMIN_VIEW_USER } from '../../../server.config.js'

import './Admin_User_Table.css'

class Modify_User_Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.data.id,
            name: this.props.data.name,
            district: this.props.data.district,
            address: this.props.data.address,
            tel: this.props.data.tel,
            checkModalShow: false
        }
    }

    handleCheckModalClose = () => {
        this.setState({ checkModalShow: false })
    }

    handleCheckModalOpen = () => {
        this.setState({ checkModalShow: true })
    }

    changeHandler = (evt) => {
        switch(evt.target.id) {
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
        }
    }

    upload_new_data = (evt) => {
        this.handleCheckModalClose()
        this.props.onClose()
        const User = "0"

        evt.preventDefault()
        fetch(ADMIN_MODIFY_USER, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: this.state.id,
                name: this.state.name,
                district: this.state.district,
                address: this.state.address,
                tel: this.state.tel,
                identity: User
            })
        })   
        .then(() => {
            this.props.fetch_data()
        })
    }

    render() {
        return (
            <>
                <Form onChange={this.changeHandler} className="modify_user_form">
                    <Form.Row>
                        <Form.Group as={Col} controlId="name">
                            <Form.Label>使用者姓名</Form.Label>
                            <Form.Control plcaeholder={this.state.name} />
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
                <Button className="save_modified_data_button"
                    variant="secondary" 
                    size="sm" 
                    onClick={this.handleCheckModalOpen}>
                    儲存
                </Button>
                <Modal show={this.state.checkModalShow} onHide={this.handleCheckModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>修改使用者</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button variant="warning" onClick={this.upload_new_data}>確定儲存?</Button>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

class Modify_User_Button extends Component {
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
                <Button className="modify_user_button"
                    variant="secondary" 
                    size="sm" 
                    onClick={this.handleOpen}> 修改 </Button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>修改使用者</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Modify_User_Form 
                            data={this.props.data} 
                            onClose={this.handleClose} 
                            fetch_data={this.props.fetch_data} />
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

class Modify_to_Delivery_Button extends Component {
    constructor(props) {
        super(props)
    }

    modify_user = (evt) => {
        const Delivery = "1"

        evt.preventDefault()
        fetch(ADMIN_MODIFY_USER, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: this.props.data.id,
                name: this.props.data.name,
                district: this.props.data.district,
                address: this.props.data.address,
                tel: this.props.data.tel,
                identity: Delivery
            })
        })   
        .then(() => {
            this.props.fetch_data()
        })
    }

    render() {
        return (
            <Button className="modify_user_to_delivery_button"
                variant="secondary" 
                size="sm" 
                onClick={this.modify_user}> 升級 </Button>
        )
    }
}

class Delete_User_Button extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkModalShow: false
        }
    }

    handleCheckModalOpen = () => {
        this.setState({ checkModalShow: true })
    }

    handleCheckModalClose = () => {
        this.setState({ checkModalShow: false })
    }

    delete_data = (evt) => {
        evt.preventDefault()
        fetch(ADMIN_DELETE_USER, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: this.props.data.id,
            })
        })
        .then(() => {
            this.props.fetch_data()
        })
    }

    render() {
        return (
            <>
                <Button className="delete_user_button"
                    variant="warning" 
                    size="sm" 
                    onClick={this.handleCheckModalOpen}> 刪除 </Button>
                <Modal show={this.state.checkModalShow} onHide={this.handleCheckModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>刪除使用者</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button variant="warning" onClick={this.delete_data}>確定刪除?</Button>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

class Admin_User_Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: []
        }
    }

    componentDidMount() {
        this.fetch_data()
    }

    fetch_data = () => {
        fetch(ADMIN_VIEW_USER)
        .then(res => res.json())
        .then(res => {
            this.setState({ datas: res })
        })
    }

    render() {
        const tableItems = this.state.datas.map((data, index) => {
            return (
                <tr key={data.id} className="table_item">
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.district + " " + data.address}</td>
                    <td>{data.tel}</td>
                    <td>{data.status}</td>
                    <td> <Modify_User_Button data={data} fetch_data={this.fetch_data} /> </td>
                    <td> <Modify_to_Delivery_Button data={data} fetch_data={this.fetch_data} /> </td>
                    <td> <Delete_User_Button data={data} fetch_data={this.fetch_data} /> </td>
                </tr>
            )
        })

        return (
            <Table striped bordered hover className="main_table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>姓名</th>
                        <th>地址</th>
                        <th>電話</th>
                        <th>狀態</th>
                        <th>修改</th>
                        <th>升級</th>
                        <th>刪除</th>
                    </tr>
                </thead>
                <tbody>
                    {tableItems}
                </tbody>
            </Table>
        )
    }
}

export default Admin_User_Table