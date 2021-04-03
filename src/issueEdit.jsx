/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBackspace, faSave } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import graphQLFetch from "./graphQLFetch";
import UserContext from "./UserContext";
import TextInput from "./Inputs/TextInput.jsx";
import NumInput from "./Inputs/NumInput.jsx";
import DateInput from "./Inputs/DateInput.jsx";
import store from "./store";
import withToast from "./withToast.jsx";
// import WithToast from "./WithToastRenderPropPattern.jsx";

class IssueEdit extends React.Component {
  // static contextType = UserContext;

  static async fetchData(match, search, showErrorMessage) {
    const query = `
      query getIssue($id:Int!) {
        issue(id:$id) {
          id,
          title,
          description,
          owner,
          status,
          due,
          createdAt,
          effort
        } 
      }  
    `;
    const { params: { id } } = match;
    // eslint-disable-next-line radix
    const result = await graphQLFetch(query, { id: parseInt(id) }, showErrorMessage);
    return result;
  }

  constructor() {
    super();
    const issue = store.initialData ? store.initialData.issue : null;
    delete store.initialData;
    this.state = {
      issue,
      invalidFields: {},
      showValidationAlert: false,
    };
    this.getIssue = this.getIssue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.OnValidityChange = this.OnValidityChange.bind(this);
    this.enableValidationAlert = this.enableValidationAlert.bind(this);
    this.dismissValidationAlert = this.dismissValidationAlert.bind(this);
  }

  componentDidMount() {
    const { issue } = this.state;
    if (!issue) {
      this.getIssue();
    }
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.getIssue();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleSubmit(e) {
    e.preventDefault();
    this.enableValidationAlert();
    const { issue: { id, createdAt, ...updates }, invalidFields } = this.state;
    const { showErrorMessage, showSuccessMessage } = this.props;
    if (Object.keys(invalidFields).length === 0) {
      const query = `
      mutation updateIssue($id:Int!,$updates:IssueUpdateInput!) {
        issueUpdate(id:$id,updates:$updates) {
          issue {
            id,title,description,status,owner,due,createdAt,effort
          },
          message
        }
      }
      `;
      const variables = { id, updates };
      graphQLFetch(query, variables, showErrorMessage)
        .then((data) => {
          if (data) {
            this.setState({ issue: data.issueUpdate.issue });
            showSuccessMessage(data.issueUpdate.message);
          }
        });
    }
  }

  onChange(e, naturalValue) {
    const { name, value: textValue } = e.target;
    // Here in case of null we should use naturalValue. Just in case of Undefined text value used
    const value = naturalValue === undefined ? textValue : naturalValue;
    // Here use parantesis to differentiate between Object curly brace and function curly brace
    this.setState((prevState) => ({ issue: { ...prevState.issue, [name]: value } }));
  }

  getIssue() {
    // const query = `
    //   query getIssue($id:Int!) {
    //     issue(id:$id) {
    //       id,
    //       title,
    //       description,
    //       owner,
    //       status,
    //       due,
    //       createdAt,
    //       effort
    //     }
    //   }
    // `;
    const { match, showErrorMessage, showSuccessMessage } = this.props;
    // eslint-disable-next-line radix
    // graphQLFetch(query, { id: parseInt(id) }, this.showErrorMessage)
    IssueEdit.fetchData(match, null, showErrorMessage)
      .then((data) => {
        // In case of none existent it returns status 200 which should thrown error which is not
        if (data) {
          this.setState({ issue: data.issue, invalidFields: {} });
          showSuccessMessage("The issue returned successfully");
        } else {
          this.setState({
            issue: {}, invalidFields: {},
          });
        }
      })
      .catch((err) => {
        showErrorMessage("An Unknown Error happened during receiving data!");
      });
  }

  OnValidityChange(e, validity) {
    const { name } = e.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !validity };
      if (!validity) {
        return { invalidFields };
      }
      const { [name]: validField, ...otherInalidFields } = invalidFields;
      return { invalidFields: otherInalidFields };
    });
  }

  enableValidationAlert() {
    this.setState({ showValidationAlert: true });
  }

  dismissValidationAlert() {
    this.setState({ showValidationAlert: false });
  }

  render() {
    const { issue } = this.state;
    const user = this.context;
    if (!issue) {
      return null;
    }
    // const { match, location } = this.props;
    const {
      issue: {
        id, title, description, createdAt, due, status, owner, effort,
      }, invalidFields, showValidationAlert,
    } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (!id) {
      if (propsId) {
        return (
          <>
            <h3>
              {`There is no issue with id equal to ${propsId}`}
            </h3>
          </>
        );
      } return null;
    }
    return (
      <>
        {user.signedIn
        || <Alert variant="danger">You should login to enable to edit issues</Alert>}
        <Card>
          <Card.Header>
            <Card.Title>
              Edit Issue:
              {title}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={this.handleSubmit} variant="secondary">
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Id</Form.Label>
                <Col sm={10}>
                  <Form.Text>{id.toString()}</Form.Text>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Title</Form.Label>
                <Col sm={10}>
                  <Form.Control as={TextInput} isInvalid={title && title.length < 10} required type="text" name="title" value={title} onChange={this.onChange} key={id} />
                  <Form.Control.Feedback type="invalid">The Title should be at least 10 Characters!</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Status</Form.Label>
                <Col sm={10}>
                  <Form.Control as="select" name="status" value={status} onChange={this.onChange}>
                    <option value="New">New</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Closed">Closed</option>
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Assignee</Form.Label>
                <Col sm={10}>
                  <Form.Control as={TextInput} type="text" name="owner" value={owner} onChange={this.onChange} key={id} />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Issue Description</Form.Label>
                <Col sm={10}>
                  <Form.Control as={TextInput} tag="textarea" rows={3} cols={80} name="description" value={description} onChange={this.onChange} key={id} />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Efforts needed (In Day)</Form.Label>
                <Col sm={10}>
                  <Form.Control as={NumInput} name="effort" value={effort} onChange={this.onChange} key={id} />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Due Date</Form.Label>
                <Col sm={10}>
                  <Form.Control as={DateInput} name="due" value={due} onChange={this.onChange} isInvalid={Object.keys(invalidFields).includes("due")} OnValidityChange={this.OnValidityChange} key={id} />
                  <Form.Control.Feedback type="invalid">
                    This field should be at format yyyy-mm-dd
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>Created At</Form.Label>
                <Col sm={10}>
                  <Form.Text>{createdAt.toDateString()}</Form.Text>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col sm={{ span: 10, offset: 2 }}>
                  <Alert
                    show={showValidationAlert && Object.keys(invalidFields).length}
                    variant="danger"
                    dismissible
                    onClose={this.dismissValidationAlert}
                  >
                    Please Correct Invalid Field(s) Before Submit
                  </Alert>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Col sm={{ offset: 9, span: 3, order: 1 }}>
                  <ButtonToolbar>
                    <LinkContainer to="/issues">
                      <Button type="button" variant="link">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Back To Issues
                      </Button>
                    </LinkContainer>
                    <Button type="submit" disabled={!user.signedIn}>
                      <FontAwesomeIcon icon={faSave} />
                      Submit
                    </Button>
                  </ButtonToolbar>
                </Col>
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer style={{ display: "flex" }}>
            <Link className="mr-auto" to={`/edit/${Number(id) - 1}`}> Previous Issue</Link>
            <Link to={`/edit/${Number(id) + 1}`}>Next Issue</Link>
          </Card.Footer>
        </Card>
      </>
    );
  }
}

// Shape of match and location Object just for Documentation
// match:{"path":"/edit/:id","url":"/edit/1","isExact":false,"params":{"id":"1"}}
// location:{"pathname":"/edit/1","search":"?q=10&x=eyes","hash":"#id"}
IssueEdit.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    hash: PropTypes.string,
  }),
  match: PropTypes.shape({
    path: PropTypes.string,
    url: PropTypes.string,
    isExact: PropTypes.bool,
    params: PropTypes.object,
  }),
  showErrorMessage: PropTypes.func,
  showSuccessMessage: PropTypes.func,
};

IssueEdit.contextType = UserContext;

const ToastedIssueEdit = withToast(IssueEdit);

// If we have static method we should redefine it in HOC
ToastedIssueEdit.fetchData = IssueEdit.fetchData;

export default ToastedIssueEdit;
