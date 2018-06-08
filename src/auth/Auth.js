import auth0 from "auth0-js/build/auth0";
import Settings from "../Settings"

export default class Auth {

    auth0 = new auth0.WebAuth({
        domain: "bagoloot.auth0.com",
        clientID: "RUe9qoLtI2fOjc21FpE460NThgWKUKST",
        redirectUri: "http://localhost:3000/",
        audience: "https://bagoloot.auth0.com/userinfo",
        responseType: "token id_token",
        scope: "openid profile"
    })

    getAccessToken() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('No Access Token found');
        }
        return accessToken;
    }

    getProfile = () => {
        return new Promise(
            (resolve, reject) => {
                // Check if the user's Yak API id is set in local storage
                const yakId = localStorage.getItem("yakId")

                // If it's set, resolve with the API id
                if (yakId !== null) {
                    resolve(yakId)

                    /*
                        Use the Auth0 userInfo() method to request the user's social
                        OpenId profile
                    */
                } else {
                    const accessToken = this.getAccessToken()
                    this.auth0.client.userInfo(accessToken, (err, profile) => {
                        if (err) {
                            reject(err)
                        }

                        /*
                            If the user's OpenId profile was successfully retrieved,
                            create an entry in the Yak API user table and resolve
                            with the new id
                        */
                        if (profile) {
                            fetch(`${Settings.remoteURL}/users`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(profile)
                            })
                                .then(user => user.json())
                                .then(user => {
                                    localStorage.setItem("yakId", user.id)
                                    resolve(user.id)
                                })
                        }
                    })
                }
            }
        )
    }

    checkAuthentication = () => {
        return new Promise(
            (resolve, reject) => {
                if (localStorage.getItem("yakId") === null) {
                    this.redirectedFromAuth0().then(haveTokens => {
                        if (!haveTokens) {
                            this.auth0.authorize()
                            resolve(false)
                        } else {
                            window.history.pushState({}, "Yak Social Network", "#");
                            resolve(true)
                        }
                    })
                } else {
                    resolve(true)
                }
            }
        )
    }

    redirectedFromAuth0 = () => {
        return new Promise(
            (resolve, reject) => {
                this.auth0.parseHash((err, authResult) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    if (authResult && authResult.accessToken && authResult.idToken) {
                        localStorage.setItem('access_token', authResult.accessToken);
                        localStorage.setItem('id_token', authResult.idToken);
                        localStorage.setItem('expires_at', JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime()));
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })

            }
        )
    }

    logout() {
        // Clear Access Token and ID Token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');

    }

    isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}



