import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

export default class StatusDropBox extends React.Component {
  constructor() {
    super();
    this.onStatusChange = this.onStatusChange.bind(this);
  }

  onStatusChange(e) {
    const { onChange } = this.props;
    onChange(e);
  }

  render() {
    // this doesnt has any react state so does render only when
    // its props changes (Propagate from Parent Component!).
    // in case of rendering parent component But (doesnt changing its Props)
    // It is rerender too!
    // console.log("I Rendered (Select Box)");
    const { value } = this.props;
    return (
      <Form.Group as={Col} xs={6} sm={6} md={2} controlId="status-selection-filter">
        <Form.Label>Status:</Form.Label>
        <Form.Control as="select" value={value} onChange={this.onStatusChange}>
          <option value="">(All)</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Fixed">Fixed</option>
          <option value="Closed">Closed</option>
        </Form.Control>
      </Form.Group>
    );
  }
}

StatusDropBox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
