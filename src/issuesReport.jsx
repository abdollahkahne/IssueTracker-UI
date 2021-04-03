/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/extensions */
import React from "react";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Collapse from "react-bootstrap/Collapse";
import Table from "react-bootstrap/Table";
import URLSearchParams from "url-search-params";
import IssueFilter from "./issueFilter.jsx";
import store from "./store";
import graphQLFetch from "./graphQLFetch";
import withToast from "./withToast.jsx";

const statuses = ["New", "Assigned", "Fixed", "Closed"];

class IssuesReport extends React.Component {
  static async fetchData(match, search, showErrorMessage) {
    const queryStringsObject = new URLSearchParams(search);
    const variables = queryStringsObject.get("status") ? { status: queryStringsObject.get("status") } : {};
    if (queryStringsObject.get("effortMax")) {
      const effortMax = Number.parseInt(queryStringsObject.get("effortMax"), 10);
      if (!Number.isNaN(effortMax)) {
        variables.effortMax = effortMax;
      }
    }
    if (queryStringsObject.get("effortMin")) {
      const effortMin = Number.parseInt(queryStringsObject.get("effortMin"), 10);
      if (!Number.isNaN(effortMin)) {
        variables.effortMin = effortMin;
      }
    }
    const query = `
    query issuesCounts($status:IssueStatus,$effortMin:Int,$effortMax:Int) {
      issueCounts(status:$status,effortMin:$effortMin,effortMax:$effortMax) {
        owner,
        New,
        Assigned,
        Fixed,
        Closed
      }
    }
    `;
    const data = await graphQLFetch(query, variables, showErrorMessage);
    return data;
  }

  constructor() {
    super();
    this.state = {
      filterNotCollapsed: false,
      counts: store.initialData ? store.initialData.issueCounts : null,
    };
    delete store.initialData;
  }

  componentDidMount() {
    const { counts } = this.state;
    if (!counts) {
      this.loadData();
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (search !== prevSearch) {
      this.loadData();
    }
  }

  loadData() {
    const {
      match, location: { search }, showErrorMessage, showSuccessMessage,
    } = this.props;
    IssuesReport.fetchData(match, search, showErrorMessage)
      .then((results) => {
        this.setState({ counts: results.issueCounts });
        showSuccessMessage("All Count Data Collected Successfully!");
      })
      .catch((err) => showErrorMessage(err.message));
  }

  render() {
    const { filterNotCollapsed, counts } = this.state;
    const statusHeader = statuses.map((status) => <th key={status}>{status}</th>);
    if (!counts) {
      return null;
    }
    const rows = counts.map((row) => {
      const {
        owner, New, Assigned, Fixed, Closed,
      } = row;
      return (
        <tr key={owner}>
          <td>{owner}</td>
          <td>
            {New || 0}
          </td>
          <td>
            {Assigned || 0}
          </td>
          <td>
            {Fixed || 0}
          </td>
          <td>
            {Closed || 0}
          </td>
          <td>
            {New + Assigned + Fixed + Closed}
          </td>
        </tr>
      );
    });

    const totalCounts = counts.reduce((row, totals) => {
      const {
        New, Assigned, Fixed, Closed,
      } = row;
      const {
        New: NewT, Assigned: AssignedT, Fixed: FixedT, Closed: ClosedT,
      } = totals;
      return {
        New: NewT + New,
        Assigned: AssignedT + Assigned,
        Fixed: FixedT + Fixed,
        Closed: ClosedT + Closed,
      };
    }, {
      New: 0, Assigned: 0, Fixed: 0, Closed: 0,
    });
    const {
      New: NewT, Assigned: AssignedT, Fixed: FixedT, Closed: ClosedT,
    } = totalCounts;

    return (
      <>
        <Card>
          <Card.Header
            onClick={() => { this.setState({ filterNotCollapsed: !filterNotCollapsed }); }}
            aria-controls="filter-card-collapse"
            aria-expanded={filterNotCollapsed}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filters
          </Card.Header>
          <Collapse in={filterNotCollapsed}>
            <Card.Body id="filter-card-collapse">
              <IssueFilter baseUrl="/report" />
            </Card.Body>
          </Collapse>
        </Card>
        <Table bordered striped responsive hover>
          <thead>
            <tr>
              <th />
              {statusHeader}
              <th>Totals</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{NewT}</th>
              <th>{AssignedT}</th>
              <th>{FixedT}</th>
              <th>{ClosedT}</th>
              <th>{NewT + AssignedT + FixedT + ClosedT}</th>
            </tr>
          </tfoot>
        </Table>
      </>
    );
  }
}

const ToastedIssueReport = withToast(IssuesReport);
ToastedIssueReport.fetchData = IssuesReport.fetchData;

export default ToastedIssueReport;
