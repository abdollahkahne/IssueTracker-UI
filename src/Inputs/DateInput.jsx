/* eslint-disable react/require-default-props */
import React from "react";
import PropTypes from "prop-types";

function toText(dateValue) {
  return dateValue ? dateValue.toISOString().substr(0, 10) : "";
}

function toDate(str) {
  const dateValue = new Date(str);
  // eslint-disable-next-line no-restricted-globals
  return isNaN(dateValue) ? null : dateValue;
}

function toDisplayFormat(dateValue) {
  return dateValue ? dateValue.toDateString() : "";
}

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: toText(props.value), focused: false, validity: true };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onChange(e) {
    if (e.target.value.match(/^[\d-]*$/)) this.setState({ value: e.target.value });
  }

  onBlur(e) {
    const { value, validity: oldValidity } = this.state;
    const { onChange, OnValidityChange } = this.props;
    const dateValue = toDate(value);
    const validity = (value === "") || !!dateValue;
    if (validity !== oldValidity && OnValidityChange) {
      OnValidityChange(e, validity);
    }
    this.setState({ focused: false, validity });
    if (validity) {
      onChange(e, dateValue);
    }
  }

  onFocus() {
    this.setState({ focused: true });
  }

  render() {
    const { value: enterdVal, validity, focused } = this.state;
    const { value: originalVal } = this.props;
    // This done now using Feedback element
    // const className = (!validity && !focused) ? "invalid" : "";
    const value = (focused || !validity) ? enterdVal : toDisplayFormat(originalVal);
    // to remove a property from an object with dynamic name
    const { OnValidityChange, ...props } = this.props;
    return (
      <input
        type="text"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        placeholder="yyyy-mm-dd"
        value={value}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
      />
    );
  }
}

DateInput.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  OnValidityChange: PropTypes.func,
};
