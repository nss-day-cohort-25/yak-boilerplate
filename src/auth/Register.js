import React, { Component } from "react"
import Settings from "../Settings"
import "./login.css"


export default class Register extends Component {

    // Set initial state
    state = {
        email: "",
        password: "",
        firstname: "",
        lastname: ""
    }

    // Update state whenever an input field is edited
    handleFieldChange = evt => {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
    }

    // Handle for login submit
    handleLogin = e => {
        e.preventDefault()

        // Determine if a user already exists in API
        fetch(`${Settings.remoteURL}/users?email=${this.state.email}`)
            .then(r => r.json())
            .then(user => {
                // User exists. Set local storage, and show home view
                if (user.length) {
                    this.props.setActiveUser(user[0].id)
                    this.props.showView("home")

                // User doesn't exist
                } else {
                    // Create user in API
                    fetch(`${Settings.remoteURL}/users`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: this.state.email,
                            password: this.state.password,
                            name: {
                                first: this.state.firstname,
                                last: this.state.lastname
                            }
                        })
                    })

                    // Set local storage with newly created user's id and show home view
                    .then(r => r.json())
                    .then(newUser => {
                        this.props.setActiveUser(newUser.id)
                        this.props.showView("home")
                    })
                }

            })
    }


    /*
        TODO:
            - Add password verification field
    */
    render() {
        return (
            <form className="form-signin" onSubmit={this.handleLogin}>
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label className="sr-only">First Name</label>
                <input onChange={this.handleFieldChange} type="text"
                       id="firstname" className="form-control"
                       placeholder="First name"
                       required="" autoFocus="" />
                <label className="sr-only">Email address</label>
                <input onChange={this.handleFieldChange} type="text"
                       id="lastname" className="form-control"
                       placeholder="Last name"
                       required="" />
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input onChange={this.handleFieldChange} type="email"
                       id="email" className="form-control"
                       placeholder="Email address"
                       required="" />
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input onChange={this.handleFieldChange} type="password"
                       id="password" className="form-control"
                       placeholder="Password" required="" />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
                <p className="mt-5 mb-3 text-muted">© 2017-2018</p>
            </form>
        )
    }
}
