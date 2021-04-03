/* eslint-disable react/require-default-props */
/* eslint-disable react/prefer-stateless-function */
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Nav from "react-bootstrap/Nav";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import graphQLFetch from "./graphQLFetch";
import withToast from "./withToast.jsx";

class IssueAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.showModalDialog = this.showModalDialog.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdding;
    const issue = {
      title: form.title.value,
      owner: form.owner.value,
      description: form.description.value,
      due: new Date(new Date().getTime() + 10 * 24 * 3600 * 1000),
    };
    const query = `
    mutation addIssue($issue:IssueInput!) {
        issueAdd(issue:$issue) {id}
    }
    `;
    const { showErrorMessage, showSuccessMessage } = this.props;
    graphQLFetch(query, { issue }, showErrorMessage)
      .then((data) => {
        this.hideModal();
        if (data.issueAdd) {
          const { history } = this.props;
          history.push({
            pathname: `/edit/${data.issueAdd.id}`,
          });
          showSuccessMessage("An issue added to the list");
        }
      })
      .catch((err) => showErrorMessage(err.message));
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  showModalDialog() {
    this.setState({ showModal: true });
  }

  render() {
    const {
      showModal,
    } = this.state;
    const { user: { signedIn } } = this.props;
    // eslint-disable-next-line react/jsx-props-no-spreading
    const tooltip = (<Tooltip id="sample-div-tooltip">Add a new issue</Tooltip>);
    return (
      <>

        <Nav.Item onClick={signedIn ? this.showModalDialog : ((e) => e.preventDefault())}>
          <OverlayTrigger overlay={tooltip} placement="left">
            <FontAwesomeIcon icon={faPlus} />
          </OverlayTrigger>
        </Nav.Item>
        <Modal show={showModal} onHide={this.hideModal} keyboard>
          <Modal.Header closeButton>
            <Modal.Title>Add New Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="issueAdding">
              <Form.Group>
                <Form.Label>Issue Title</Form.Label>
                <Form.Control type="text" name="title" autoFocus />
              </Form.Group>
              <Form.Group>
                <Form.Label>Issue Owner</Form.Label>
                <Form.Control type="text" name="owner" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Issue Description</Form.Label>
                <Form.Control as="textarea" name="description" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideModal}>Cancel</Button>
            <Button disabled={!signedIn} variant="primary" onClick={this.handleSubmit}>Add Issue</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

IssueAddNavItem.propTypes = {
  history: PropTypes.object,
  showErrorMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
  user: PropTypes.object,
};

export default withRouter(withToast(IssueAddNavItem));
