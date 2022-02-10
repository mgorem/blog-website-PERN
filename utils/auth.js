// Helps in authentication

import auth0 from 'auth0-js'; //Property used to initialize the Auth0 app
import history from './history';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'webapp1.auth0.com',
    clientID: '',
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid profile email'
  })

  //Empty object that will hold the user profile data from Auth0
  userProfile = {}

  //brings up the Auth0 login widget, allowing the user to login with the given .authorize() function
  login = () => {
      this.auth0.authorize()
  }

  //Saves the id and access tokens from Auth0 to the local browser storage 
  //Also sets the token expires time.
  handleAuth = () => {
    this.auth0.parseHash((err, authResult) => {
      if(authResult) {
        localStorage.setItem('access_token', authResult.accessToken)
        localStorage.setItem('id_token', authResult.idToken)

        let expiresAt = JSON.stringify((authResult.expiresIn * 1000 + new Date().getTime()))
        localStorage.setItem('expiresAt', expiresAt)

        this.getProfile();
        setTimeout(() => { history.replace('/authcheck') }, 600);
      } else {
        console.log(err)
      }
    })
  }

  //Get the access token from local storage
  getAccessToken = () => {
    if(localStorage.getItem('access_token')) {
      const accessToken = localStorage.getItem('access_token')
      return accessToken
    } else {
      return null
    }
  }

  //Parse the access token to extract the user profile data
  getProfile = () => {
    let accessToken = this.getAccessToken()
    if(accessToken) {
      this.auth0.client.userInfo(accessToken, (err, profile) => {
          if(profile) {
            this.userProfile = { profile }
          }
      } )
    }
  }


  //Logs out the user by removing the tokens from local storage
  logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expiresAt')
    setTimeout(() => { history.replace('/authcheck') }, 200);
  }

  //Makes sure the user is logged in by comparing the expires time to the current time
  isAuthenticated = () => {
    let expiresAt = JSON.parse(localStorage.getItem('expiresAt'))
    return new Date().getTime() < expiresAt
  }

}
