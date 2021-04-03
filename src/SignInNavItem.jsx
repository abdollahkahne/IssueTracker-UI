/* eslint-disable react/prop-types */
import React from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import withToast from "./withToast.jsx";

class SignInNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      disabled: false, // has no logic now!
    };
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
    this.showModalDialog = this.showModalDialog.bind(this);
    this.hideModalDialog = this.hideModalDialog.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  // This methods Moved to Parent who have related state to signIn which is page component!
  componentDidMount() {
    const { showErrorMessage, user } = this.props;
    const clientID = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientID) {
      showErrorMessage("Missing environment variable GOOGLE_CLIENT_ID");
      return;
    }
    window.gapi.load("auth2", () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({ client_id: clientID })
          .then(() => this.setState({ disabled: false }));
      }
    });
    if (!user) this.loadData();
  }

  loadData() {
    const { showErrorMessage, onChangeUser } = this.props;
    const authEndPoint = window.ENV.UI_AUTH_ENDPOINT;
    fetch(`${authEndPoint}/user`, {
      credentials: "include",
      method: "POST",
      headers: { accept: "application/json" },
    })
      .then((res) => res.json())
      .then((credentials) => {
        onChangeUser(credentials);
        // const { signedIn, givenName } = credentials;
        // this.setState({ user: { signedIn, givenName } });
      })
      .catch((err) => showErrorMessage(err.message));
  }

  showModalDialog() {
    const { showErrorMessage } = this.props;
    const clientID = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientID) {
      showErrorMessage("Missing environment variable GOOGLE_CLIENT_ID");
      return;
    }
    this.setState({ showModal: true });
  }

  hideModalDialog() {
    this.setState({ showModal: false });
  }

  signOut() {
    const { showErrorMessage, showSuccessMessage, onChangeUser } = this.props;
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut()
      .then(() => {
        auth2.disconnect();
        const { UI_AUTH_ENDPOINT } = window.ENV;
        return fetch(`${UI_AUTH_ENDPOINT}/signout`, {
          method: "POST",
          credentials: "include",
        });
      })
      .then(((res) => res.json()))
      .then((value) => {
        const { message } = value;
        onChangeUser(null);
        // this.setState({ user: { signedIn: false, givenName: "" } });
        showSuccessMessage(message);
      })
      .catch((err) => showErrorMessage(err.message));
  }

  signIn() {
    this.hideModalDialog();
    const { showErrorMessage, onChangeUser } = this.props;
    const auth2Instance = window.gapi.auth2.getAuthInstance();
    auth2Instance.signIn()
      .then((googleUser) => {
        const googleToken = googleUser.getAuthResponse().id_token;
        const authEndPoint = window.ENV.UI_AUTH_ENDPOINT;
        return fetch(`${authEndPoint}/signin`, {
          credentials: "include",
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ google_token: googleToken }),
        });
      })
      .then((res) => res.json())
      .then((val) => {
        onChangeUser(val);
        // this.setState({
        //   user: { signedIn: val.signedIn, givenName: val.givenName },
        // });
      })
      .catch((err) => showErrorMessage(err.message));
  }

  render() {
    const { showModal, disabled } = this.state;
    const { user: { givenName, signedIn } } = this.props;
    if (signedIn) {
      return (
        <NavDropdown alignRight title={givenName} id="username-dropdown">
          <NavDropdown.Item onClick={this.signOut} disabled={disabled}>Sign Out</NavDropdown.Item>
        </NavDropdown>
      );
    }
    return (
      <>
        <Nav.Item onClick={this.showModalDialog}>Sign In</Nav.Item>
        <Modal show={showModal} onHide={this.hideModalDialog} keyboard>
          <Modal.Header>
            <Modal.Title>User Sign In Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button block variant="primary" disabled={disabled} onClick={this.signIn}>
              <img src="/images/btn_google_signin_light_normal_web.png" alt="Google Sign In" />
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={this.hideModalDialog}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const ToastedSignInNavItem = withToast(SignInNavItem);

export default ToastedSignInNavItem;
