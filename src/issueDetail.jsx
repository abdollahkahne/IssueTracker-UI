/* eslint-disable react/prop-types */
import React from "react";

export default function IssueDetail(props) {
  const { issue } = props;
  if (issue) {
    return (
      <>
        <hr />
        <h4>{issue.title}</h4>
        <p>{issue.description}</p>
        <hr />
      </>
    );
  }
  return null;
}
