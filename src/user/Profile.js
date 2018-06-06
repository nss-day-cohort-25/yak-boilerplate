import React, { Component } from "react"
import Settings from "../Settings"
import $ from "jquery"
import Post from "../newsfeed/Post"
import modal from "jquery-modal/jquery.modal"
import Avatar from "../images/avatar.png"
import "./Profile.css"
import "jquery-modal/jquery.modal.css"


export default class Profile extends Component {
    state = {
        posts: [],
        name: ""
    }

    FriendButton = () => {
        if (
            this.props.activeUser !== this.props.userId &&
            !this.props.isFriend
        ) {
            return (
            <button onClick={this.addFriend} type="button" className="btn btn-outline-primary">
                Add Friend
            </button>
            )
        } else {
            return (<div></div>)
        }
    }

    addFriend = e => {
        fetch(`${Settings.remoteURL}/friends`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                requestingFriendId: parseInt(this.props.activeUser, 10),
                acceptedFriendId: parseInt(this.props.userId, 10),
                pending: true
            })
        })
        $("#friendModal").modal({
            fadeDuration: 250,
            fadeDelay: 1.5,
            showClose: false,
            blockerClass: ""
        })
        window.setTimeout(() => { $.modal.close() }, 3000)
    }

    follow = e => {
        $("#followModal").modal({
            fadeDuration: 250,
            fadeDelay: 1.5,
            showClose: false
        })
        window.setTimeout(() => { $.modal.close() }, 3000)
    }


    componentDidMount() {
        fetch(`${Settings.remoteURL}/posts?userId=${this.props.userId}&_expand=user&_page=1&_limit=5&_sort=id&_order=desc`)
            .then(r => r.json())
            .then(posts => {
                // If user has posts, grab their name from the first posts
                if (posts.length) {
                    this.setState({
                        posts: posts,
                        name: `${posts[0].user.name.first} ${posts[0].user.name.last}`
                    })

                    // User had no posts, query user table directly
                } else {
                    fetch(`${Settings.remoteURL}/users/${this.props.userId}`)
                        .then(r => r.json())
                        .then(u => {
                            this.setState({
                                posts: posts,
                                name: `${u.name.first} ${u.name.last}`
                            })
                        })
                }
            })
    }

    render() {
        return (
            <div className="container-full">
                <span id="friendModal" className="modal">Friend request sent!</span>
                <span id="followModal" className="modal">You have successfully followed {this.state.name}</span>
                <div className="row">
                    <div className="col col-sm-1">
                    </div>
                    <div className="col content col-sm-10">
                        <div className="newsfeed">
                            <img className="card-img-top avatar" src={Avatar} alt="Generic person image" />
                            <h1>{this.state.name} Profile</h1>

                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group mr-2" role="group">
                                    <button onClick={this.follow} type="button" className="btn btn-outline-primary">
                                        Follow
                                    </button>
                                </div>
                                <div className="btn-group" role="group">
                                    <this.FriendButton />
                                </div>
                            </div>

                            {
                                this.state.posts.map(p => <Post key={p.id} post={p} />)
                            }
                        </div>
                    </div>
                    <div className="col col-sm-1">
                    </div>
                </div>
            </div>
        )
    }
}
