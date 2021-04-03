/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prefer-stateless-function */
import React from "react";
import Toast from "react-bootstrap/Toast";
import Collapse from "react-bootstrap/Collapse";

export default function withToast(OrignalComponent) {
  return class ToastWrapper extends React.Component {
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
      const { showToast, toastMessage, toastVariant } = this.state;
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
          <OrignalComponent
            showErrorMessage={this.showErrorMessage}
            showSuccessMessage={this.showSuccessMessage}
            {...this.props}
          />
        </>
      );
    }
  };
}
