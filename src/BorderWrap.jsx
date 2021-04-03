import React from "react";
import PropTypes from "prop-types";

export default function BorderWrap(props) {
  const { children } = props;
  const borderedStyle = {
    border: "4px solid grey",
    padding: 8,
    backgroundColor: "gray",
    margin: 4,
    borderRadius: 8,
  };
  return (
    <div style={borderedStyle}>
      {children}
    </div>
  );
}

BorderWrap.propTypes = {
  children: PropTypes.element.isRequired,
};
