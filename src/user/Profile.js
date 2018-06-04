import React, { Component } from "react"
import Post from "../newsfeed/Post";
import Avatar from "../images/avatar.png"
import "./Profile.css"


export default class Profile extends Component {
    state = {
        posts: [],
        name: ""
    }

    componentDidMount() {
        fetch(`http://localhost:5001/posts?userId=${this.props.userId}&_expand=user&_page=1&_limit=5&_sort=id&_order=desc`)
            .then(r => r.json())
            .then(posts => {
                this.setState({
                    posts: posts,
                    name: `${posts[0].user.name.first} ${posts[0].user.name.last}`
                })
            })
    }

    render() {
        return (
            <div className="container-full">
                <div className="row">
                    <div className="col col-sm-1">
                    </div>
                    <div className="col content col-sm-10">
                        <div className="newsfeed">
                            <img className="card-img-top avatar" src={Avatar} alt="Generic person image" />
                            <h1>{this.state.name} Profile</h1>

                            <div className="btn-toolbar" role="toolbar">
                                <div className="btn-group mr-2" role="group">
                                    <button type="button" className="btn btn-outline-primary">Follow</button>
                                </div>
                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-primary">Add Friend</button>
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
