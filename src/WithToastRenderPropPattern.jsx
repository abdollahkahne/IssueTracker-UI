/* eslint-disable react/prop-types */
/* eslint-disable max-classes-per-file */
import React from "react";
import { Toast, Collapse } from "react-bootstrap";

class ToastUsingRenderProp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      toastMessage: "",
      toastVariant: "success",
    };
    this.showErrorMessage = this.showErrorMessage.bind(this);
    this.showSuccessMessage = this.showSuccessMessage.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  showSuccessMessage(message) {
    this.setState({ showToast: true, toastMessage: message, toastVariant: "success" });
  }

  showErrorMessage(message) {
    this.setState({ showToast: true, toastVariant: "danger", toastMessage: message });
  }

  dismissToast() {
    this.setState({ showToast: false });
  }

  render() {
    const { render: renderProp } = this.props;
    return renderProp(this.state);
  }
}

export default class WithToast extends React.Component {
  constructor() {
    super();
    this.showToast = this.showToast.bind(this);
  }

  showToast(state) {
    const { children } = this.props;
    const { showToast, toastMessage, toastVariant } = state;
    return (
      <>
        <Toast
          transition={Collapse}
          delay={10000}
          autohide
          style={{
            position: "fixed", top: 0, right: 0, zIndex: 10,
          }}
          show={showToast}
          onClose={this.dismissToast}
          variant={toastVariant}
        >
          <Toast.Header className="justify-content-between">{toastVariant === "success" ? "Congratulation!" : "Error"}</Toast.Header>
          <Toast.Body>
            <p>{toastMessage}</p>
          </Toast.Body>
        </Toast>
        {children}
      </>
    );
  }

  render() {
    return (
      <ToastUsingRenderProp render={this.showToast} />
    );
  }
}
