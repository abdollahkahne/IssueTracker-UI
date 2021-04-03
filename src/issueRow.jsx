import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import {faWindowClose} from "@fortawesome/free-regular-svg-icons";
// import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import { withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import PropTypes from "prop-types";
import UserContext from "./UserContext";

function IssueRow(props) {
  const {
    issue, location: { search }, deleteIssue, closeIssue, index,
  } = props;

  const { signedIn } = useContext(UserContext);

  // id is required property for Tooltip. Provide it!
  const closeTooltip = (<Tooltip id="close-tooltip" placement="top">Close Issue As Tooltip</Tooltip>);
  const editTooltip = (<Tooltip id="edit-tooltip" placement="top">Edit Issue</Tooltip>);
  const tableRow = (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.status}</td>
      <td>{issue.owner}</td>
      <td>{issue.createdAt.toDateString()}</td>
      <td>{issue.effort}</td>
      <td>{issue.due ? issue.due.toDateString() : ""}</td>
      <td>{issue.title}</td>
      <td>
        <OverlayTrigger delay={{ show: 500, hide: 300 }} overlay={editTooltip}>
          <LinkContainer to={`/edit/${issue.id}`}>
            <Button disabled={!signedIn} size="sm" variant="light" className="p-0 m-0">
              <FontAwesomeIcon size="lg" color="blue" icon={faEdit} />
            </Button>
          </LinkContainer>
        </OverlayTrigger>
        <OverlayTrigger delay={{ show: 1000, hide: 1000 }} overlay={closeTooltip}>
          <Button
            disabled={!signedIn}
            variant="light"
            style={{ padding: "0px", margin: "0px" }}
            size="sm"
            type="button"
            onClick={(e) => { e.preventDefault(); closeIssue(index); }}
          >
            <FontAwesomeIcon
              color="green"
              size="lg"
              icon={faArchive}
            />
          </Button>
        </OverlayTrigger>

        <Button
          disabled={!signedIn}
          title="Delete Issue As Title!"
          variant="light"
          size="sm"
          style={{ padding: "0px", margin: "0px" }}
          type="button"
          onClick={(e) => { e.preventDefault(); deleteIssue(index); }}
        >
          <FontAwesomeIcon color="red" size="lg" icon={faTrash} />
        </Button>
      </td>
    </tr>
  );
  return (<LinkContainer style={{ cursor: "pointer" }} to={{ pathname: `/issues/${issue.id}`, search }}>{tableRow}</LinkContainer>);
}

IssueRow.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.oneOf(["New", "Assigned", "Closed", "Fixed"]),
    owner: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    effort: PropTypes.number,
    due: PropTypes.instanceOf(Date),
    title: PropTypes.string,
  }).isRequired,
  location: PropTypes.object.isRequired,
  deleteIssue: PropTypes.func.isRequired,
  closeIssue: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default withRouter(IssueRow);
