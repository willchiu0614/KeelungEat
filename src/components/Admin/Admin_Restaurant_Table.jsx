import React, { Component } from 'react'
import { Table, Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { ADMIN_VIEW_ALL_RESTAURANT, ADMIN_DELETE_RESTAURANT } from '../../../server.config.js'

class Admin_Restaurant_Table extends Component {
    constructor(props) {
        super(props)

        this.state = {
            datas: [],
            checkModalShow: false,
            delete_store_id: null
        }
    }

    get_new_data = () => {
        fetch(ADMIN_VIEW_ALL_RESTAURANT)
        .then(res => res.json())
        .then(res => {
            this.setState({ datas: res })
        })
    }

    delete_restaurant = () => {
        this.handleCheckModalClose()
        fetch(ADMIN_DELETE_RESTAURANT, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: this.state.delete_store_id
            })
        })
        .then(() => this.get_new_data())
    }

    componentDidMount() {
        this.get_new_data()
    }

    handleCheckModalClose = () => {
        this.setState({ checkModalShow: false })
    }

    handleCheckModalOpen = (evt) => {
        this.setState({ checkModalShow: true, delete_store_id: evt.target.value })
    }

    render() {
        const tableItems = this.state.datas.map((data, index) => {
            return (
                <tr key={data.id}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.district + " " + data.address}</td>
                    <td>{data.tel}</td>
                    <td>
                        <Button as={Link} data={data} size="sm"
                            to={{
                                pathname: `/Modify_Restaurant`,
                                state: {
                                    data: data
                                }
                            }}
                            variant="secondary" >
                            ??????
                        </Button>
                    </td>
                    <td>
                        <Button variant="secondary" size="sm" onClick={this.handleCheckModalOpen} value={data.id} >
                            ??????
                        </Button>
                    </td>
                </tr>
            )
        })

        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>??????</th>
                        <th>??????</th>
                        <th>??????</th>
                        <th>??????</th>
                        <th>??????</th>
                    </tr>
                </thead>
                <tbody>
                    {tableItems}
                </tbody>
                <Modal show={this.state.checkModalShow} onHide={this.handleCheckModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>????????????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button variant="warning" onClick={this.delete_restaurant}>?????????????</Button>
                    </Modal.Body>
                </Modal>
            </Table>
        )
    }
}

export default Admin_Restaurant_Table