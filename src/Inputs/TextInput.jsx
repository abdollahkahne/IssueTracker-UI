/* eslint-disable react/require-default-props */
import React from "react";
import PropTypes from "prop-types";

function toText(value) {
  return (value) || "";
}

function Textify(str) {
  return (str === "") ? null : str;
}

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: toText(props.value) };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(e) {
    this.setState({ value: e.target.value });
  }

  // Use onBlur for elevating the state instead of OnChange for performance
  onBlur(e) {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(e, Textify(value));
  }

  render() {
    const { tag = "input", ...props } = this.props;
    const { value } = this.state;
    return React.createElement(tag, {
      ...props,
      value,
      onChange: this.onChange,
      onBlur: this.onBlur,
    });
  }
}

TextInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  tag: PropTypes.string,
};
