import React, { Component } from "react"
import "./SearchResults.css"
import Avatar from "../images/avatar.png"
import "../newsfeed/Post.css"


export default class SearchResults extends Component {
    // Set initial state
    state = {
        posts: [],
        users: [],
        events: []
    }

    showProfile = (e) => {
        const id = e.target.id.split("--")[1]
        this.props.viewHandler("profile", {userId: id})
    }

    render() {
        return (
            <div className="searchResults">
                <h1>Search Results</h1>
                {
                    this.props.foundItems.posts.map(p =>
                        <div className="card post" key={p.id}>
                            <div className="card-body">
                                <h5 className="card-title">By {p.user.name}</h5>
                                <p className="card-text">
                                    {p.message}
                                </p>
                                <a href="#" className="btn btn-outline-success">Like</a>
                            </div>
                        </div>
                    )
                }

                {
                    this.props.foundItems.users.map(u =>
                        <div className="card post" key={u.id}>
                            <img className="card-img-top avatar" src={Avatar} alt="Generic person image" />
                            <div className="card-body">
                                <h5 className="card-title">{u.name}</h5>
                                <a href="#" onClick={this.showProfile}
                                   id={`user--${u.id}`}
                                   className="btn btn-outline-success">View profile</a>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}
