import React, { Component } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'
import NavBar from './nav/NavBar';
import Home from './newsfeed/Home';
import Login from './auth/Login';
import SearchResults from './search/SearchResults';
import Profile from './user/Profile';

class App extends Component {

    // Set initial state
    state = {
        currentView: "login",
        searchTerms: "",
        activeUser: localStorage.getItem("yakId"),
        foundItems: {
            posts: [],
            users: []
        }
    }

    SearchingView = () => "<h1>Searching...</h1>"

    // Search handler -> passed to NavBar
    performSearch = function (terms) {
        this.setState({
            searchTerms: terms,
            currentView: "searching"
        })

        const futureFoundItems = {}

        fetch(`http://localhost:5001/posts?message_like=${encodeURI(terms)}&_expand=user`)
            .then(r => r.json())
            .then(posts => {
                futureFoundItems.posts = posts
                return fetch(`http://localhost:5001/users?q=${encodeURI(terms)}`)
            })
            .then(r => r.json())
            .then(users => {
                futureFoundItems.users = users
                this.setState({
                    foundItems: futureFoundItems,
                    currentView: "results"
                })
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
            activeUser: val
        })
    }

    // View switcher -> passed to NavBar and Login
    // Argument can be an event (via NavBar) or a string (via Login)
    showView = function (e, ...props) {
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
            this.setActiveUser(null)
        }

        // Update state to correct view will be rendered
        this.setState({
            currentView: view,
            viewProps: Object.assign({}, ...props)
        })

    }.bind(this)

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
        if (localStorage.getItem("yakId") === null) {
            return <Login showView={this.showView} setActiveUser={this.setActiveUser} />
        } else {
            switch (this.state.currentView) {
                case "searching":
                    return <this.SearchingView />
                case "logout":
                    return <Login showView={this.showView}
                                  setActiveUser={this.setActiveUser} />
                case "results":
                    return <SearchResults foundItems={this.state.foundItems} />
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
                />

                {this.View()}
            </article>
        )
    }
}

export default App
