import React from "react";
import PropTypes from "prop-types";

// this function is like toString() which convert our type to string
function toText(num) {
  return (num ? num.toString() : "");
}

// this function is like parse() which convert string to our type
function toNaturalType(str) {
  const val = parseInt(str, 10);
  // eslint-disable-next-line no-restricted-globals
  return (isNaN(val) ? null : val);
}

export default class NumInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: toText(props.value) };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(e) {
    if (e.target.value.match(/^\d*$/)) {
      this.setState({ value: e.target.value });
    }
  }

  onBlur(e) {
    const { value } = this.state;
    const { onChange } = this.props;
    onChange(e, toNaturalType(value)); // this is a reason behind to use e as first argument.
  }

  // We assume that the type is string and worked with it as state type.
  // prop value type is in our type and after finishing editing it get edite value in type (parsed)
  // prop onChange callback
  render() {
    const { value } = this.state;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <input type="text" {...this.props} value={value} onChange={this.onChange} onBlur={this.onBlur} />;
  }
}

NumInput.propTypes = {
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};
