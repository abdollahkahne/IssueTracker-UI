/* eslint-disable react/prop-types */
import React from "react";
import SelectAsync from "react-select/async";
import { withRouter } from "react-router-dom";
import graphQLFetch from "./graphQLFetch";
import withToast from "./withToast.jsx";

class Search extends React.Component {
  constructor() {
    super();
    this.loadOptions = this.loadOptions.bind(this);
    this.onChangeSelection = this.onChangeSelection.bind(this);
  }

  onChangeSelection(option) {
    const { history } = this.props;
    history.push(`/edit/${option.value}`);
  }

  async loadOptions(term) {
    const { showErrorMessage } = this.props;
    if (term.length < 3) return [];
    const query = `
        query searchIssue($q:String!) {
            issueList(q:$q) {
                issues {
                    id,title
                }
            }
        }
        `;
    return graphQLFetch(query, { q: term }, showErrorMessage)
      .then((data) => data.issueList.issues.map((issue) => ({ label: `#${issue.id}:${issue.title}`, value: issue.id })))
      .catch((err) => showErrorMessage(err.message));
  }

  render() {
    return (
      <SelectAsync
        instanceId="navbar-search"
        components={{ DropdownIndicator: null }}
        value=""
        onChange={this.onChangeSelection}
        defaultOptions
        filterOption={() => true}
        loadOptions={this.loadOptions}
        placeholder="Type term to search"
      />
    );
  }
}

export default withRouter(withToast(Search));
