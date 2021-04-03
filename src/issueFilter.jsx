/* eslint-disable react/require-default-props */
import React from "react";
import PropTypes from "prop-types";
import URLSearchParams from "url-search-params";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import InputGroup from "react-bootstrap/InputGroup";
import StatusDropBox from "./statusDropBox.jsx";

class IssueFilter extends React.Component {
  constructor(props) {
    super(props);
    const { location: { search } } = this.props;
    const queryStringsObject = new URLSearchParams(search);
    this.state = {
      status: queryStringsObject.get("status") || "",
      effortMin: queryStringsObject.get("effortMin") || "",
      effortMax: queryStringsObject.get("effortMax") || "",
      formChanged: false,
    };
    this.applyFilter = this.applyFilter.bind(this);
    this.updateFilterAccordingToUrl = this.updateFilterAccordingToUrl.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.onEffortMaxChange = this.onEffortMaxChange.bind(this);
    this.onEffortMinChange = this.onEffortMinChange.bind(this);
  }

  // In case of changing URL but not re-mounting component
  // this hook should used
  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (search !== prevSearch) {
      this.updateFilterAccordingToUrl();
    }
  }

  onStatusChange(e) {
    // console.log("I trigged!");
    this.setState({ status: e.target.value, formChanged: true });
  }

  onEffortMinChange(e) {
    // RegExp.test(string) Or string.match(regexp)
    if (e.target.value.match(/^\d*$/)) this.setState({ effortMin: e.target.value, formChanged: true });
  }

  onEffortMaxChange(e) {
    // RegExp.test(string) Or string.match(regexp)
    if (/^\d*$/.test(e.target.value)) this.setState({ effortMax: e.target.value, formChanged: true });
  }

  updateFilterAccordingToUrl() {
    const { location: { search } } = this.props;
    const queryStringsObject = new URLSearchParams(search);
    this.setState({
      status: queryStringsObject.get("status") || "",
      effortMin: queryStringsObject.get("effortMin") || "",
      effortMax: queryStringsObject.get("effortMax") || "",
      formChanged: false,
    });
  }

  applyFilter() {
    const { history, baseUrl } = this.props;
    const { status, effortMax, effortMin } = this.state;
    const urlSearchParams = new URLSearchParams();
    if (status) urlSearchParams.set("status", status);
    if (effortMax) urlSearchParams.set("effortMax", effortMax);
    if (effortMin) urlSearchParams.set("effortMin", effortMin);
    history.push({
      pathname: baseUrl,
      search: urlSearchParams.toString(),
    });
  }

  render() {
    // When a control changed to an internal state of control changed and
    // sets its value equal to changed value (Uncontrolled Behviour). Now it
    // trigger OnChange event too. for now not rendering happens because React doesnt
    // know about change (No Props Or State has changed!!). So If we have a controlled input
    // then we should implement setting an state in onChange Event handler
    // (which makes control rerender too because an state changed!). In rerendering the value
    // of Input returned to its initial state which may be empty string/constant string or
    // the changed State itself. Does now it account a change that trigger onChange???
    // No. It is initial value setting. so the on change doesnt trigger more. Also if trigged to
    // because no change happens in state, no rendering happens.
    // console.log("I Rendered (Filter)", this.state);
    const {
      status, effortMax, effortMin, formChanged,
    } = this.state;
    return (
      <Form>
        <Form.Row>
          <StatusDropBox size={3} value={status} onChange={this.onStatusChange} />
          <Form.Group as={Col} xs={6} sm={6} md={4} lg={2}>
            <Form.Label>Needed Effort Between:</Form.Label>
            <InputGroup>
              <Form.Control size={5} type="text" value={effortMin} onChange={this.onEffortMinChange} />
              <InputGroup.Text>-</InputGroup.Text>
              <Form.Control size={5} type="text" value={effortMax} onChange={this.onEffortMaxChange} />
            </InputGroup>
          </Form.Group>
          <Form.Group as={Col} xs={6} sm={6} md={4} lg={2}>
            <Form.Label>&nbsp;</Form.Label>
            <ButtonToolbar>
              <Button size={3} variant="primary" type="button" onClick={this.applyFilter}>Apply</Button>
              <Button size={3} variant="light" type="button" onClick={this.updateFilterAccordingToUrl} disabled={!formChanged}>Reset</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form.Row>
      </Form>
    );
  }
}

IssueFilter.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  baseUrl: PropTypes.string,
};

export default withRouter(IssueFilter);
