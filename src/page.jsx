/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from "react";
import Container from "react-bootstrap/Container";
import Headers from "./Headers.jsx";
import UserContext from "./UserContext";
import Contents from "./Contents.jsx";
import "isomorphic-fetch";
import withToast from "./withToast.jsx";
import graphQLFetch from "./graphQLFetch.js";
import store from "./store.js";

function Footer() {
  return (
    <small>
      <hr />
      <p className="text-center">
        Full source code available at this
        {" "}
        <a href="https://github.com/abdollahkahne/pro-mern-stack-2">
          GitHub repository
        </a>
      </p>
    </small>
  );
}

class Page extends React.Component {
  static async fetchData(cookie) {
    const query = `
    query {
      user {
        givenName, signedIn
      }
    }
    `;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  constructor() {
    super();
    this.state = {
      user: (store.userData ? store.userData.user : null),
    };
    delete store.userData;
    this.onChangeUser = this.onChangeUser.bind(this);
    // this.loadData = this.loadData.bind(this);
  }

  // componentDidMount() {
  //   const { showErrorMessage } = this.props;
  //   const clientID = window.ENV.GOOGLE_CLIENT_ID;
  //   if (!clientID) {
  //     showErrorMessage("Missing environment variable GOOGLE_CLIENT_ID");
  //     return;
  //   }
  //   window.gapi.load("auth2", () => {
  //     if (!window.gapi.auth2.getAuthInstance()) {
  //       window.gapi.auth2.init({ client_id: clientID });
  //     }
  //   });
  //   this.loadData();
  // }

  onChangeUser(user) {
    if (user) {
      const { givenName } = user;
      this.setState({ user: { signedIn: true, givenName } });
    } else {
      this.setState({ user: { signedIn: false, givenName: "" } });
    }
  }

  // loadData() {
  //   const { showErrorMessage } = this.props;
  //   const authEndPoint = window.ENV.UI_AUTH_ENDPOINT;
  //   fetch(`${authEndPoint}/user`, {
  //     method: "POST",
  //     headers: { accept: "application/json" },
  //   })
  //     .then((res) => res.json())
  //     .then((credentials) => {
  //       this.onChangeUser(credentials);
  //       // const { signedIn, givenName } = credentials;
  //       // this.setState({ user: { signedIn, givenName } });
  //     })
  //     .catch((err) => showErrorMessage(err.message));
  // }

  render() {
    const { user } = this.state;
    // The following condition does not happen because Page is centeral component
    // in every route and it is inserted just for consistency in case of SSR Routs!
    if (user === null) return null;
    return (
      <>
        <Headers user={user} onChangeUser={this.onChangeUser} />
        <Container fluid>
          <UserContext.Provider value={user}>
            <Contents />
          </UserContext.Provider>
        </Container>
        <Footer />
      </>
    );
  }
}

const ToastedPage = withToast(Page);
ToastedPage.fetchData = Page.fetchData;

export default ToastedPage;
