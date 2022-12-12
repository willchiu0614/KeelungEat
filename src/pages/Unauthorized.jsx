import React, { Component } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'

import Header from '../components/Header.jsx'

class Unauthorized extends Component {
    render() {
        return (
            <div>
                <div className="container-fluid content-center">
                    <Header />
                    <hr />
                    <div className="row  justify-content-center no-gutters">
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Unauthorized