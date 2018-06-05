import React, { Component } from 'react'
import Settings from "./Settings"
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'
import NavBar from './nav/NavBar';
import Home from './newsfeed/Home';
import Login from './auth/Login';
import SearchResults from './search/SearchResults';
import Profile from './user/Profile';
import Register from './auth/Register';

class App extends Component {
    constructor (props) {
        super(props)

        // Set initial state
        this.state = {
            currentView: "login",
            searchTerms: "",
            activeUser: localStorage.getItem("yakId"),
            foundItems: {
                posts: [],
                users: []
            },
            notifications: []
        }

        this.getNotifications()

    }


    SearchingView = () => (<h1 style={{ marginTop: `125px` }}>Searching...</h1>)


    getNotifications = () => {
        let notes = []

        // Any pending friend requests
        return fetch(`${Settings.remoteURL}/friends?acceptedFriendId=${this.state.activeUser}&pending=true`)
            .then(r => r.json())
            .then(relationships => {
                if (relationships.length) {
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
                }

            })


        // A friend has sent a private message

        // A friend has created a new event
    }


    // Search handler -> passed to NavBar
    performSearch = function (terms) {
        this.setState({
            searchTerms: terms,
            currentView: "searching"
        })

        const futureFoundItems = {}

        fetch(`${Settings.remoteURL}/posts?message_like=${encodeURI(terms)}&_expand=user`)
            .then(r => r.json())
            .then(posts => {
                futureFoundItems.posts = posts
                return fetch(`${Settings.remoteURL}/users?q=${encodeURI(terms)}`)
            })
            .then(r => r.json())
            .then(users => {
                futureFoundItems.users = users

                setTimeout(() => {
                    this.setState({
                        foundItems: futureFoundItems,
                        currentView: "results"
                    })

                }, 1000);
            })
    }.bind(this)

    // Function to update local storage and set activeUser state
    setActiveUser = (val) => {
        if (val) {
            localStorage.setItem("yakId", val)
        } else {
            localStorage.removeItem("yakId")
        }
        this.setState({
            activeUser: val,
            notifications: []
        })
    }

    // View switcher -> passed to NavBar and Login
    // Argument can be an event (via NavBar) or a string (via Login)
    showView = (e, ...props) => {
        let view = null

        // Click event triggered switching view
        if (e.hasOwnProperty("target")) {
            view = e.target.id.split("__")[1]

            // View switch manually triggered by passing in string
        } else {
            view = e
        }

        // If user clicked logout in nav, empty local storage and update activeUser state
        if (view === "logout") {
            // Update state to correct view will be rendered
            this.setState({
                currentView: "logout",
                activeUser: null,
                notifications: [],
                viewProps: Object.assign({}, ...props)
            })
        } else {
            // Update state to correct view will be rendered
            this.setState({
                currentView: view,
                viewProps: Object.assign({}, ...props)
            })
            this.getNotifications()
        }

    }

    /*
        Function to determine which main view to render. This, very likely,
        should be broken out into its own module.

        TODO:
            1. Profile view
            2. Register view
            3. Create event view
            4. Make this function its own module
    */
    View = () => {
        if (localStorage.getItem("yakId") === null && this.state.currentView !== "register") {
            return <Login showView={this.showView}
                          setActiveUser={this.setActiveUser} />
        } else if (localStorage.getItem("yakId") === null && this.state.currentView === "register") {
            return <Register showView={this.showView}
                             setActiveUser={this.setActiveUser} />
        } else {
            switch (this.state.currentView) {
                case "searching":
                    return <this.SearchingView />
                case "profile":
                    return <Profile {...this.state.viewProps}
                                    activeUser={this.state.activeUser}
                                    viewHandler={this.showView} />
                case "logout":
                    return <Login showView={this.showView}
                                  setActiveUser={this.setActiveUser} />
                case "results":
                    return <SearchResults foundItems={this.state.foundItems}
                                          viewHandler={this.showView} />
                case "home":
                default:
                    return <Home activeUser={this.state.activeUser}
                                 viewHandler={this.showView} />
            }
        }
    }

    render() {
        return (
            <article>
                <NavBar viewHandler={this.showView}
                    searchHandler={this.performSearch}
                    activeUser={this.state.activeUser}
                    setActiveUser={this.setActiveUser}
                    notifications={this.state.notifications}
                />

                {this.View()}
            </article>
        )
    }
}

export default App
