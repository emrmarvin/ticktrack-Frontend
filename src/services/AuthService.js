import * as Msal from 'msal';

export default class AuthService {
  constructor() {
    let PROD_REDIRECT_URI = process.env.VUE_APP_REDIRECT_URI;
    let redirectUri = process.env.VUE_APP_REDIRECT_URI;

    if (window.location.hostname !== '127.0.0.1') {
      redirectUri = PROD_REDIRECT_URI;
    }
    this.applicationConfig = {
      clientID: process.env.VUE_APP_CLIENT_ID,
      postLogoutRedirectUri: process.env.VUE_APP_POST_LOGOUT_REDIRECT_URI,
      graphScopes: ['user.read']
    };
    this.app = new Msal.UserAgentApplication(
      this.applicationConfig.clientID,
      '',
      () => {
        // callback for login redirect
      },
      {
        redirectUri
      },
      {
        storeAuthStateInCookie: true
      }
    );
  }
  login() {
    sessionStorage.setItem('Login','success')
    return this.app.loginRedirect(this.applicationConfig.graphScopes).then(
      idToken => {
        const user = this.app.getUser();
        if (user) {
          
          return user;
        } else {
          return null;
        }
      },
      () => {
        return null;
      }
    );
  };

  logout() {
    this.app.logout();
  };
  getToken() {
    return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
      accessToken => {
        return accessToken;
      },
      error => {
        return this.app
          .acquireTokenPopup(this.applicationConfig.graphScopes)
          .then(
            accessToken => {
              return accessToken;
            },
            err => {
              console.error(err);
            }
          );
      }
    );
  };
}
