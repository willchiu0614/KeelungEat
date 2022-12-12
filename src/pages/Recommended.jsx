import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import './theme.css'

import Header from '../components/Header.jsx'
import Recommended_Card from '../components/Recommended/Recommended_Card.jsx'

import { CONSUMER_SEARCH_LOCATION } from '../../server.config.js'

class Recommended extends Component {
    constructor(props) {
        super(props)
        this.state = {
            address: this.props.match.params.address,
            district: this.props.match.params.district,
            recommended: []
        }
    }

    componentDidMount() {
        fetch(CONSUMER_SEARCH_LOCATION, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "district": this.state.district
            })
        })   
        .then(res => res.json())
        .then(res => {
            console.log(res)
            this.setState({ recommended: res })
        })
    }

    render() {
        const delivery_address = {
            district: this.state.district,
            address: this.state.address
        }

        const recommended_restaurants = this.state.recommended.map((rest, index) => {
            return <Recommended_Card key={index} rest={rest} delivery_address={delivery_address}/>
        })

        return (
            <div>
                <div className="container-fluid container-center">
                    <Header />
                    <br /><br />
                    <div className="row align-items-center justify-content-center no-gutters">
                        {recommended_restaurants}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Recommended)