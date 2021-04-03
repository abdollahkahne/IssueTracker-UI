/* eslint-disable import/extensions */
import React from "react";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import IssueRow from "./issueRow.jsx";

export default function IssueTable(props) {
  const { issues, closeIssue, deleteIssue } = props;
  // in Functional Component React.useContext is used instead of this.context;
  // Another way is to send it as second argument in function which needs contextType too!
  // const { user } = React.useContext(UserContext);
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue, index) => (
          <IssueRow
            key={issue.id}
            index={index}
            issue={issue}
            closeIssue={closeIssue}
            deleteIssue={deleteIssue}
          />
        ))}
      </tbody>
    </Table>
  );
}

IssueTable.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.oneOf(["New", "Assigned", "Closed", "Fixed"]),
    owner: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    effort: PropTypes.number,
    due: PropTypes.instanceOf(Date),
    title: PropTypes.string,
  })).isRequired,
  deleteIssue: PropTypes.func.isRequired,
  closeIssue: PropTypes.func.isRequired,
};
