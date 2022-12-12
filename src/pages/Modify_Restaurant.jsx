import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import Header from '../components/Header.jsx'
import Modify_Restaurant_Form from '../components/Utils/Modify_Restaurant_Form.jsx'

import './theme.css'

class Modify_Restaurant extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const data = this.props.location.state.data
        console.log(data)
        return (
            <div style={{height: '90vh'}}>
                <Container className="container-fluid container-center">
                    <Header />
                    <hr />
                    <Modify_Restaurant_Form data={data}/>
                </Container>
            </div>
        )
    }
}

export default withRouter(Modify_Restaurant)

