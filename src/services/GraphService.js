import AuthService from "./AuthService";
import axios from "axios";
export default class GraphService {

  constructor() {
    this.graphUrl = 'https://graph.microsoft.com/v1.0';
  }

  getUserInfo(token) {
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    const options = {
      headers
    };
    return fetch(`${this.graphUrl}/me`, options)
      .then(response => response.json())
      .catch(response => {
        throw new Error(response.text());
      });
  }

  getUserImage(token) {
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    const options = {
      headers
    };
    return fetch(`${this.graphUrl}/me/photo/$value`, options)
      .then(response => response.id)
      .catch(response => {
        throw new Error(response.id);
      });
  }
}
