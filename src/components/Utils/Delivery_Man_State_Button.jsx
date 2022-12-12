import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import io from 'socket.io-client'
import Cookies from 'js-cookie'

import './User_Button.css'

import { server_address, AUTH } from '../../../server.config.js'

class Delivery_Man_State_Button extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: 1
        }
        this.delivery_socket = io(server_address + '/delivery_man_current', {
            query: { token: Cookies.get('token') }
        })
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
            this.setState({datas: res[0].status})
        })

        this.delivery_socket.on('delivery_man_state_update', data => {
            if(data !== [])
                this.setState({ datas: data })
        })
    }

    componentWillUnmount() {
        this.delivery_socket.disconnect()
    }

    handleStateUpdate = () => {
        this.delivery_socket.emit('delivery_man_state_update')
    }

    render() {
        console.log(this.state.datas)
        const LButton = this.state.datas == 1
            ? <Button variant="secondary" onClick={() => this.handleStateUpdate()}>上線中</Button>
            : <Button variant="secondary" onClick={() => this.handleStateUpdate()}>下線中</Button>
        return LButton
    }
}

export default Delivery_Man_State_Button