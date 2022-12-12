import React, { Component } from 'react'
import { Container } from 'react-bootstrap'

import Header from '../components/Header.jsx'
import New_Restaurant_Form from '../components/Utils/New_Restaurant_Form.jsx'

import './theme.css'

class New_Restaurant extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div style={{height: '90vh'}}>
                <Container className="container-fluid container-center">
                    <Header />
                    <hr />
                    <New_Restaurant_Form />
                </Container>
            </div>
        )
    }
}

export default New_Restaurant

