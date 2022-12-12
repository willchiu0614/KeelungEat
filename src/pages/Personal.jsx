import React, { Component } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

import { CHECK, AUTH } from '../../server.config.js'

import './theme.css'

import Header from '../components/Header.jsx'
import PersonalDashboard from '../components/Personal/PersonalDashboard.jsx'
import PersonalOrder from '../components/Personal/PersonalOrder.jsx'

class Personal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            show_list_id: 0,
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
            if (res == true) {
                fetch(AUTH, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'
                })
                .then(res => res.json())
            }
        })
    }

    showPersonalOrder = () => {
        this.setState({ show_list_id: 0 })
    }

    showPersonalDashboard = () => {
        this.setState({ show_list_id: 1 })
    }

    render() {
        let table = <PersonalOrder />

        if (this.state.show_list_id == 0)
            table = <PersonalOrder />
        else if (this.state.show_list_id == 1)
            table = <PersonalDashboard />
        

        return (
            <>
                    <div>
                        <div className="container-fluid content-center">
                            <Header />
                            <hr />
                            <div className="row  justify-content-center no-gutters">
                                <div className="col-md-2">
                                    <ButtonGroup className="btn_all " vertical size="lg">
                                        <Button variant="outline-info" onClick={this.showPersonalOrder}>
                                                目前訂單
                                        </Button>
                                        <Button variant="outline-info" onClick={this.showPersonalDashboard}>
                                                個人資料
                                        </Button>
                                    </ButtonGroup>
                                </div>
                                <div className="col-md-8">
                                    {table}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
        )
    }
}

export default Personal