import auth0 from "auth0-js/build/auth0";

export default class Auth {

    auth0 = new auth0.WebAuth({
        domain: "bagoloot.auth0.com",
        clientID: "RUe9qoLtI2fOjc21FpE460NThgWKUKST",
        redirectUri: "http://localhost:3000/",
        audience: "https://bagoloot.auth0.com/userinfo",
        responseType: "token id_token",
        scope: "openid"
    })

    checkAuthentication = (currentView) => {
        if (localStorage.getItem("id_token") === null && currentView !== "register") {
            this.auth0.parseHash((err, authResult) => {
                if (err) {
                    console.log(err)
                }
                if (authResult && authResult.accessToken && authResult.idToken) {
                    localStorage.setItem('access_token', authResult.accessToken);
                    localStorage.setItem('id_token', authResult.idToken);
                    localStorage.setItem('expires_at', JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime()));
                    return true
                } else {
                     return this.auth0.authorize()
                }
            })
        }
    }

    logout() {
        // Clear Access Token and ID Token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // navigate to the home route

    }

    isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}



