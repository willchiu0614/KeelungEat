import React, { Component } from 'react'
import { server_address, UPLOAD_IMAGE } from '../../../../server.config.js'

import './ImageLoader.css'

class ImageLoader extends Component {
    constructor(props) {
        super(props)
        this.state = { imageURL: '' }
    }

    handleUploadImage = (ev) => {
        ev.preventDefault()

        const data = new FormData()
    
        data.append('file', this.uploadInput.files[0])
        data.append('food_name', this.props.food_name)
        data.append('store_name', this.props.store_name)

        fetch(UPLOAD_IMAGE, {
            method: 'POST',
            body: data
        })
        .then((response) => {
            response.json().then((body) => {
                this.setState({ imageURL: `${server_address}/test_docs/${body.file}.png` })
            });
        });
    }

    render() {
        return (
            <form onSubmit={this.handleUploadImage} className="image_loader_form">
                <div>
                    <input ref={ref => { this.uploadInput = ref; }} type="file" />
                </div>
                <div>
                    <button>Upload</button>
                </div>
                <img src={this.state.imageURL} alt="img" />
            </form>
        );
    }
}

export default ImageLoader