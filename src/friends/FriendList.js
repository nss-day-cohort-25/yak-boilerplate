import React, { Component } from "react"
import Avatar from "../images/avatar.png"
import "./FriendList.css"
import Settings from "../Settings"


export default class FriendList extends Component {

    // Set initial state
    state = {
        friends: []
    }

    unique = function* (arr) {
        const map = new Map()
        let i = 0

        while (i < arr.length) {
            const key = arr[i]
            if (!map.has(key) && map.set(key, 1)) yield arr[i]
            i++
        }
    }.bind(this)

    showProfile = (e) => {
        const id = e.target.id.split("--")[1]
        this.props.viewHandler("profile", {userId: id})
    }

    componentDidMount() {
        console.log("FriendList componentDidMount")

        let allFriendships = []

        fetch(`${Settings.remoteURL}/friends?acceptedFriendId=${this.props.activeUser}`)
            .then(r => r.json())
            .then(relationships => {
                allFriendships = allFriendships.concat(relationships.map(r => r.requestingFriendId))
                return fetch(`${Settings.remoteURL}/friends?requestingFriendId=${this.props.activeUser}`)
            })
            .then(r => r.json())
            .then(relationships => {
                if (relationships.length) {
                    /*
                        allFriendships gets concat run with the new array, then only unique values
                        are extracted, converted from Map to an array, then put in URL query string
                        format, and joined together with &
                    */
                    allFriendships = [...this.unique(allFriendships.concat(relationships.map(r => r.acceptedFriendId)))]
                        .map(id => `id=${id}`)
                        .join("&")

                    // Query users table for all matching friends
                    fetch(`${Settings.remoteURL}/users?${allFriendships}`)
                        .then(r => r.json())
                        .then(users => {
                            this.setState({ friends: users })
                        })
                }
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
