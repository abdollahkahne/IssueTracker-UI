import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default class IssueAdd extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      title: form.title.value,
      owner: form.owner.value,
      description: "",
      due: new Date(new Date().getTime() + 10 * 24 * 3600 * 1000),
    };
      // We should cosider this here! use bind for example or Arrow function or e=>this.handleSubmit
    const { createIssue } = this.props;
    createIssue(issue);
    // Empty Form for next issue
    form.owner.value = "";
    form.title.value = "";
  }

  render() {
    return (
      <Form inline name="issueAdd" onSubmit={(e) => this.handleSubmit(e)}>
        <Form.Group>
          <Form.Label>Owner</Form.Label>
          <Form.Control type="text" name="owner" placeholder="Owner" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control style={{ width: "30rem" }} type="text" name="title" placeholder="Title" />
        </Form.Group>
        <Button type="submit">Add Issue</Button>
      </Form>
    );
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};
