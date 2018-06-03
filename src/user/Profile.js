import React, { Component } from "react"


export default class Profile extends Component {

    componentDidMount() {
        fetch(`http://localhost:5001/posts?userId=${this.props.userId}&_expand=user`)
            .then(r => r.json())
            .then(posts => this.setState({ posts: posts }))
    }


    render() {
        return (
            <h1 className="container-full">Profile </h1>
        )
    }
}
