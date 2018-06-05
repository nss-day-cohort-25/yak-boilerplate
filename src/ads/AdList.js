import React, { Component } from "react"
import Settings from "../Settings"
import Ad from "./Ad"



export default class AdList extends Component {

    state = {
        ads: []
    }

    componentDidMount () {
        fetch(`${Settings.remoteURL}/ads`)
            .then(r => r.json())
            .then(ads => this.setState({ads: ads}))
    }

    render() {
        return (
            <div>
                <h5 className="sideHeader">Ads chosen for you</h5>
                {
                    this.state.ads.map(ad => <Ad key={ad.id} ad={ad} />)
                }
            </div>
        )
    }
}
