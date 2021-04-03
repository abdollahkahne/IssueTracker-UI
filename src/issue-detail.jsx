import React from "react";
import PropTypes from "prop-types";
import graphQLFetch from "./graphQLFetch";

export default class IssueDetail extends React.Component {
  constructor(props) {
    super(props);
    // {} is better than null because null.title is error but {}.title is undefined and
    // script ignore it in undefined case while it throw an erorr and quite in case of nul.
    this.state = { issue: {} };
    this.getIssue = this.getIssue.bind(this);
  }

  componentDidMount() {
    this.getIssue();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.getIssue();
    }
  }

  getIssue() {
    const { match: { params: { id } } } = this.props;
    // eslint-disable-next-line radix
    const intId = parseInt(id);
    const query = `query getIssue($id:Int!) {
        issue(id:$id) {
            title,
            description
        }
    }`;
    graphQLFetch(query, { id: intId })
      .then((data) => {
        this.setState({ issue: data.issue });
      })
      // eslint-disable-next-line no-unused-vars
      .catch((_err) => { this.setState({ issue: {} }); });
  }

  render() {
    const { issue } = this.state;
    return (
      <>
        <hr />
        <h4>{issue.title}</h4>
        <p>{issue.description}</p>
        <hr />
      </>
    );
  }
}

IssueDetail.propTypes = {
  match: PropTypes.object.isRequired,
};
