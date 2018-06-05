import React, { Component } from "react"
import Settings from "../Settings"
import yak from "../images/yak.png"
import $ from "jquery"
import profilepic from "../images/profile.png"
import "./NavBar.css"


export default class NavBar extends Component {

    // Set initial state
    state = {
        searchTerms: "",
        notifications: []
    }

    /**
     * Local search handler, which invokes the searchHandler reference
     * passed from App
     */
    search = (e) => {
        if (e.charCode === 13) {
            this.props.searchHandler(this.state.searchTerms)
            this.setState({ searchTerms: "" })
        }
    }

    LoginLogout = () => {
        if (this.props.activeUser === null) {
            return <a className="nav-link" id="nav__login"
                onClick={this.props.viewHandler} href="#">Login</a>
        } else {
            return <a className="nav-link" id="nav__logout"
                onClick={this.props.viewHandler} href="#">Logout</a>
        }
    }

    getNotifications = () => {
        let notes = []

        // Any pending friend requests
        fetch(`${Settings.remoteURL}/friends?acceptedFriendId=${this.props.activeUser}&pending=true`)
            .then(r => r.json())
            .then(relationships => {

                const allFriendships = relationships.map(r => r.requestingFriendId)
                        .map(id => `id=${id}`)
                        .join("&")

                // Query users table for all matching friends
                fetch(`${Settings.remoteURL}/users?${allFriendships}`)
                    .then(r => r.json())
                    .then(users => {
                        notes = notes.concat(users.map(u => `${u.name.first} ${u.name.last} has sent you a friend request`))
                        this.setState({
                            notifications: notes
                        })
                    })

            })


        // A friend has sent a private message

        // A friend has created a new event
    }

    componentDidMount () {
        this.getNotifications()
    }

    handleFieldChange = (evt) => {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
    }

    render() {
        return (
            <nav className="navbar navbar-light fixed-top light-blue flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-sm-3 col-md-2 mr-0" onClick={this.props.viewHandler} href="#">
                    <img id="nav__home" src={yak} style={{ height: `50px` }} />
                </a>
                <input id="searchTerms"
                    value={this.state.searchTerms}
                    onChange={this.handleFieldChange}
                    onKeyPress={this.search}
                    className="form-control w-100"
                    type="search"
                    placeholder="Search"
                    aria-label="Search" />
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">

                        <a href="#" className="notif" id="nav__profile" onClick={()=>$(".profileMenu").slideToggle(333)}>
                            <span className="num">{this.state.notifications.length}</span>
                        </a>
                    </li>
                </ul>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <this.LoginLogout />
                    </li>
                </ul>
                <article className="profileMenu">
                    <section className="profileMenu__item">
                        {
                            this.state.notifications.map((n, idx) =>
                                <div key={idx}><a title="notifications" id="nav__notifications" href="#">{n}</a></div>)
                        }
                    </section>
                </article>
            </nav>
        )
    }
}
