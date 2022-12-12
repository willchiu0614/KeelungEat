import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { DISTANCE } from '../../../server.config.js'

import './Recommended_Card.css'

class Recommended_Card extends Component {
    constructor(props) {
        super(props)
        this.state = {
            distance: '',
            delivery_time: ''
        }
    }

    componentDidMount() {
        console.log(this.props.rest)
        fetch(DISTANCE, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                source : this.props.rest.district + this.props.rest.address,
	            dest: this.props.delivery_address.district + this.props.delivery_address.address 
            })
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                distance: res[0].distance,
                delivery_time: res[0].duration
            })
        })
    }

    render() {
        const image_style = {
            height: "200px",
            width: '18rem'
        }

        return (
            <div className="col-9 col-md-4" align="center">
                <Card 
                    className="recommended_card"
                    bg="info" 
                    text="white" 
                    as={Link} 
                    to={{
                        pathname: "/Restaurant/"+this.props.rest.name,
                        state: {
                            rest: this.props.rest,
                            delivery_address: this.props.delivery_address
                        }
                      }} >
                    <Card.Img style={image_style} 
                        variant="top"
                        src={this.props.rest.image_url}
                    />
                    <Card.Body>
                        <Card.Title>{this.props.rest.name}</Card.Title>
                        <Card.Text>
                            <p>外送距離: {this.state.distance}</p>
                            <p>外送時間: {this.state.delivery_time}</p>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
        
export default Recommended_Card