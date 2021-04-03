/* eslint-disable react/require-default-props */
/* eslint-disable react/prefer-stateless-function */
import React from "react";
import PropTypes from "prop-types";
import Alert from "react-bootstrap/Alert";
import Collapse from "react-bootstrap/Collapse";

export default class CustomeToast extends React.Component {
  constructor(props) {
    super(props);
    this.closeTimeout = null;
  }

  componentDidUpdate() {
    const { show, onClose } = this.props;
    if (show) {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
      this.closeTimeout = setTimeout(onClose, 5000);
    }
  }

  // On Unmount clear all timouts!
  componentWillUnmount() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
    }
  }

  render() {
    const {
      variant, show, children, onClose,
    } = this.props;

    return (
      <Collapse in={show}>
        <div id="toast-notification" style={{ position: "fixed", top: 20, right: 20 }}>
          <Alert variant={variant} onClose={onClose} dismissible>
            {children}
          </Alert>
        </div>
      </Collapse>
    );
  }
}

CustomeToast.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.string.isRequired,
  children: PropTypes.any,
};
