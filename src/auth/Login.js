import React, { Component } from "react"
import Settings from "../Settings"
import $ from "jquery"
import modal from "jquery-modal/jquery.modal"
import "jquery-modal/jquery.modal.css"
import "./login.css"


export default class Login extends Component {

    // Set initial state
    state = {
        email: "",
        password: ""
    }

    // Update state whenever an input field is edited
    handleFieldChange = function (evt) {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
    }.bind(this)

    // Handle for login submit
    handleLogin = (e) => {
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
                    $("#nouserfound").modal({
                        showClose: false,
                        blockerClass: ""
                      })
                    window.setTimeout(() => { $.modal.close() }, 2000)

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
                <span id="nouserfound" className="modal">No user found with that email</span>
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input onChange={this.handleFieldChange} type="email"
                       id="email" className="form-control"
                       placeholder="Email address"
                       required="" autoFocus="" />
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input onChange={this.handleFieldChange} type="password"
                       id="password" className="form-control"
                       placeholder="Password" required="" />
                <div className="checkbox mb-3">
                    <input type="checkbox" value="remember-me" /> Remember me
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>

                <p className="mt-5 mb-3 text-muted">
                or <a id="link__register" onClick={this.props.showView} href="#">Register a new account</a>
                </p>

                <p className="mt-5 mb-3 text-muted">© 2017-2018</p>
            </form>
        )
    }
}
