import React, { Component } from "react"
import Avatar from "../images/avatar.png"
import "./FriendList.css"


export default class FriendList extends Component {

    // Set initial state
    state = {
        friends: []
    }

    params = (res, fk, prop) => res.map(r => `${fk}=${r[prop]}`).join("&")

    showProfile = (e) => {
        const id = e.target.id.split("--")[1]
        this.props.viewHandler("profile", {userId: id})
    }

    componentDidMount() {
        fetch(`https://nss-kitty-purry.herokuapp.com/friends?requestingFriendId=${this.props.activeUser}`)
            .then(r => r.json())
            .then(relationships => {
                const queryString = this.params(relationships, "id", "acceptedFriendId")
                return fetch(`https://nss-kitty-purry.herokuapp.com/users?${queryString}`)
            })
            .then(r => r.json())
            .then(users => {
                this.setState({ friends: users })
            })
    }

    render() {
        return (
            <div className="friendList">
               <h5 className="sideHeader">Friends</h5>
                {
                    this.state.friends.map(u =>
                        <div className="card" key={u.id}>
                            <img className="card-img-top avatar" src={Avatar} alt="Generic person image" />
                            <div className="card-body">
                                <a className="card-title friendList__name"
                                   id={`friend--${u.id}`}
                                   onClick={this.showProfile}
                                   href="#">{u.name.first} {u.name.last}</a>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}
