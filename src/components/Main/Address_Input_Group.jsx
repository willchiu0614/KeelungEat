import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { InputGroup, Dropdown, DropdownButton, FormControl, Button } from 'react-bootstrap'

import './Address_Input_Group.css'

class Address_Input_Group extends Component {
    constructor(props) {
        super(props)
        this.state = {
            admin_district: '行政區',
            detail_address: '無'
        }
    }

    render() {
        return (
            <>
                <InputGroup className="address_input_group">
                    <DropdownButton
                        as={InputGroup.Prepend}
                        variant="info"
                        title={this.state.admin_district}
                        onSelect={(evt) => { this.setState({ admin_district: evt }) }}
                    >
                        <Dropdown.Item eventKey='中正區'>中正區</Dropdown.Item>
                        <Dropdown.Item eventKey='七堵區'>七堵區</Dropdown.Item>
                        <Dropdown.Item eventKey='暖暖區'>暖暖區</Dropdown.Item>
                        <Dropdown.Item eventKey='仁愛區'>仁愛區</Dropdown.Item>
                        <Dropdown.Item eventKey='中山區'>中山區</Dropdown.Item>
                        <Dropdown.Item eventKey='安樂區'>安樂區</Dropdown.Item>
                        <Dropdown.Item eventKey='信義區'>信義區</Dropdown.Item>
                    </DropdownButton>
                    <FormControl className="address_form_control"
                        placeholder={this.state.detail_address}
                        onChange={(evt) => { this.setState({ detail_address: evt.target.value })}}
                    />
                </InputGroup>
                 
                <Button
                    as={Link} 
                    to={{ pathname: "/Recommended"+`/${this.state.admin_district}/${this.state.detail_address}` }} 
                    variant="info" 
                    type="submit" 
                    className="submit_address_button">
                        Submit
                </Button> 
            </>
        )
    }
}

export default Address_Input_Group