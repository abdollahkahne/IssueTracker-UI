/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */

import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import URLSearchParams from "url-search-params";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";
// import { Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Pagination from "react-bootstrap/Pagination";
import graphQLFetch from "./graphQLFetch";
// import BorderWrap from "./BorderWrap.jsx";
import IssueFilter from "./issueFilter.jsx";
import IssueTable from "./issueTable.jsx";
// import IssueAdd from "./issueAdd.jsx";
import IssueDetail from "./issueDetail.jsx";
import store from "./store";
import withToast from "./withToast.jsx";

function PageLink({
  params, page, activePage, children,
}) {
  params.set("page", page);
  if (page === 0) {
    return React.cloneElement(children, { disabled: true });
  }
  return (
    <LinkContainer to={{ search: `${params.toString()}` }} isActive={() => (activePage === page)}>
      {children}
    </LinkContainer>
  );
}

class IssueList extends React.Component {
  static async fetchData(match, search, showErrorMessage) {
    const queryStringsObject = new URLSearchParams(search);
    const variables = queryStringsObject.get("status") ? { status: queryStringsObject.get("status") } : {};
    if (queryStringsObject.get("effortMax")) {
      const effortMax = parseInt(queryStringsObject.get("effortMax"), 10);
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(effortMax)) {
        variables.effortMax = effortMax;
      }
    }
    if (queryStringsObject.get("effortMin")) {
      const effortMin = parseInt(queryStringsObject.get("effortMin"), 10);
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(effortMin)) {
        variables.effortMin = effortMin;
      }
    }
    if (queryStringsObject.get("page")) {
      const page = Number.parseInt(queryStringsObject.get("page"), 10);
      if (!Number.isNaN(page)) {
        variables.page = page;
      }
    }
    variables.issueSelected = false;
    const { params: { id } } = match;
    variables.selectedIssueID = 0;
    if (id) {
      variables.issueSelected = true;
      variables.selectedIssueID = Number.parseInt(id, 10);
    }
    const query = `
          query issueList($status:IssueStatus,$effortMin:Int,$effortMax:Int,$page:Int,$issueSelected:Boolean!,$selectedIssueID:Int!) {
              issueList(status:$status,effortMin:$effortMin,effortMax:$effortMax,page:$page) {
                issues {id,title,owner,status,createdAt,
                  effort,due},
                pages
              },
              issue(id:$selectedIssueID) @include (if: $issueSelected) {
                id,title,description
              }
          }
          `;
    const data = await graphQLFetch(query, variables, showErrorMessage);
    return data;
  }

  constructor(props) {
    super(props);
    this.state = {
      issues: store.initialData ? store.initialData.issueList.issues : null,
      selectedIssue: store.initialData ? store.initialData.issue : null,
      pages: store.initialData ? store.initialData.issueList.pages : null,
      filterNotCollapsed: false,
    };
    // This better to done due to different meaning of object in different page and let them reload
    // it if needed. for example issue in editIssue and view issue component are different
    delete store.initialData;
    // this.createIssue = this.createIssue.bind(this);
    this.closeIssue = this.closeIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.undoDelete = this.undoDelete.bind(this);
  }

  componentDidMount() {
    const { issues } = this.state;
    if (!issues) {
      this.loadData();
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch }, match: { params: { id: prevId } } } = prevProps;
    const { location: { search }, match: { params: { id } } } = this.props;
    if (search !== prevSearch || id !== prevId) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match, showErrorMessage } = this.props;
    // const queryStringsObject = new URLSearchParams(search);
    // eslint-disable-next-line max-len
    // const variables = queryStringsObject.get("status") ? { status: queryStringsObject.get("status") } : {};
    // if (queryStringsObject.get("effortMax")) {
    //   const effortMax = parseInt(queryStringsObject.get("effortMax"), 10);
    //   // eslint-disable-next-line no-restricted-globals
    //   if (!isNaN(effortMax)) {
    //     variables.effortMax = effortMax;
    //   }
    // }
    // if (queryStringsObject.get("effortMin")) {
    //   const effortMin = parseInt(queryStringsObject.get("effortMin"), 10);
    //   // eslint-disable-next-line no-restricted-globals
    //   if (!isNaN(effortMin)) {
    //     variables.effortMin = effortMin;
    //   }
    // }
    // const query = `
    //       query issueList($status:IssueStatus,$effortMin:Int,$effortMax:Int) {
    //           issueList(status:$status,effortMin:$effortMin,effortMax:$effortMax) {
    //               id,title,owner,status,createdAt,
    //               effort,due
    //           }
    //       }
    //       `;
    // const response=await fetch("/_api",{
    //     method:"POST",
    //     headers:{
    //         'content-type':"application/json"
    //     },
    //     body:JSON.stringify({query:query})
    // });
    // // This doesnt support adding reviver so we use Json.parse as bellow
    // // const result=await response.json();
    // const body=await response.text();
    // const result=JSON.parse(body,isoDateReviver);
    // this.setState({issues:result.data.issueList});
    const data = await IssueList.fetchData(match, search, showErrorMessage);
    if (data) {
      this.setState({
        issues: data.issueList.issues,
        pages: data.issueList.pages,
        selectedIssue: data.issue,
      });
      // this.showSuccessMessage("All Issues Loaded successfully");
    }
  }

  deleteIssue(index) {
    const { issues } = this.state;
    const {
      history, location: { pathname, search }, showErrorMessage, showSuccessMessage,
    } = this.props;
    const { id } = issues[index];
    const query = `
      mutation deleteIssue($id:Int!) {
        issueDelete(id:$id)
      }
    `;
    graphQLFetch(query, { id }, showErrorMessage)
      .then((data) => {
        if (data.issueDelete) {
          this.setState((prevState) => {
            const allIssues = [...prevState.issues];
            allIssues.splice(index, 1);
            // if user see issue description in Header detail pattern push him to new location
            if (pathname === `/issues/${id}`) {
              history.push({ pathname: "/issues", search });
            }
            const successMessage = (
              <span>
                Selected Issue Deleted successfully!
                <Button variant="link" onClick={() => this.undoDelete(id)}>UNDO</Button>
              </span>
            );
            showSuccessMessage(successMessage);
            return { issues: allIssues };
          });
        }
      });
  }

  undoDelete(id) {
    const { showErrorMessage, showSuccessMessage } = this.props;
    const query = `
      mutation undeleteIssue($id:Int!) {
        issueRestore(id:$id)
      }
    `;
    graphQLFetch(query, { id }, showErrorMessage)
      .then((data) => {
        if (data.issueRestore) {
          showSuccessMessage("The deleted issue restored successfully!");
          this.loadData();
        } else {
          showErrorMessage("Something went wrong! please try later!");
        }
      })
      .catch((err) => {
        showErrorMessage(err.message);
      });
  }

  closeIssue(index) {
    const { showErrorMessage, showSuccessMessage } = this.props;
    const { issues } = this.state;
    const { id } = issues[index];
    const query = `
      mutation closeIssue($id:Int!) {
        issueUpdate(id:$id, updates:{status:Closed}) {
          issue {
            id,title,owner,status,createdAt,
                  effort,due
          }
        }
      }
    `;
    graphQLFetch(query, { id }, showErrorMessage)
      .then((data) => {
        if (data) {
          this.setState((prevState) => {
            // Here prevState is Object but prevStat.issues is an array
            const newIssuesList = [...prevState.issues]; // Always make a copy and work on It!
            newIssuesList[index] = data.issueUpdate.issue;
            showSuccessMessage("Status of Selected Issues changed to Closed Successfully");
            // returns state Object partially or fully
            return { issues: newIssuesList };
          });
        } else {
          this.loadData();
        }
      });
  }

  // createIssue(addedIssue) {
  //   // const query=`
  //   // mutation AddANewIssue($issueTitle:String!,$issueOwner:String,$issueDue:GraphQLDate) {
  //   //     issueAdd(issue:
  //   //         {title:$issueTitle,
  //   //         owner:$issueOwner,
  //   //         due:$issueDue})
  //   //         {id}
  //   // }
  //   // `;

  //   // const variables={
  //   //     issueTitle:issue.title,
  //   //     issueOwner:issue.owner,
  //   //     issueDue:issue.due.toISOString()
  //   // };

  //   // issue.AddedField="Just for test case!"
  //   // This makes type of issue different than IssueInputs!

  //   // for the case of enum you have three Options:
  //   // 1- Using Variables for the enum property
  //   // 2- using template and set it in template without quote
  //   // 3 Define with name and value equal to name and value of enum!
  //   const Assigned = "Assigned";
  //   const issue = addedIssue;
  //   issue.status = Assigned;
  //   const query = `
  //         mutation AddANewIssue($issue:IssueInput!) {
  //             issueAdd(issue:$issue)
  //                 {id}
  //         }
  //         `;
  //   graphQLFetch(query, { issue }, this.showErrorMessage)
  //   // eslint-disable-next-line no-unused-vars
  //     .then((_data) => {
  //       this.showSuccessMessage("Issue Added Successfully!");
  //       this.loadData();
  //     });

  //   // fetch("/_api",{
  //   //     method:"POST",
  //   //     headers:{
  //   //         "accept":"application/json",
  //   //         "content-type":"application/json"
  //   //     },
  //   //     body:JSON.stringify({query,variables:{issue},operationName:"AddANewIssue"})
  //   // })
  //   // .then(res=>res.json())
  //   // .then(result=>{this.loadData()});
  // }

  render() {
    const {
      issues, filterNotCollapsed, selectedIssue, pages,
    } = this.state;
    if (!issues) {
      return null;
    }

    const { location: { search } } = this.props;
    const qsObject = new URLSearchParams(search);
    let page = Math.floor(qsObject.get("page"));
    if (Number.isNaN(page) || page < 1) {
      page = 1;
    }
    if (page > pages) {
      page = pages;
    }
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(pages, page + 2);
    const pageItems = [];
    if (page !== 1) {
      pageItems.push(
        <PageLink key="first" params={qsObject} page={1} activePage={0}>
          <Pagination.First />
        </PageLink>,
      );
    }
    if (page > 1) {
      pageItems.push(
        <PageLink key="previous" params={qsObject} page={page - 1} activePage={0}>
          <Pagination.Prev />
        </PageLink>,
      );
    }
    if (page > 3) {
      pageItems.push(
        <PageLink key="1" params={qsObject} page={1} activePage={page}>
          <Pagination.Item>1</Pagination.Item>
        </PageLink>,
      );
    }
    if (page > 4) {
      const middlePage = Math.floor((page - 3) / 2) + 1;
      pageItems.push(
        // eslint-disable-next-line max-len
        <PageLink key={middlePage} params={qsObject} page={middlePage} activePage={page}>
          <Pagination.Ellipsis />
        </PageLink>,
      );
    }
    for (let i = startPage; i <= endPage; i += 1) {
      pageItems.push(
        <PageLink key={i} params={qsObject} page={i} activePage={page}>
          <Pagination.Item>{i}</Pagination.Item>
        </PageLink>,
      );
    }
    if (page < pages - 3) {
      const middlePage = pages - Math.floor((pages - page - 2) / 2);
      pageItems.push(
        // eslint-disable-next-line max-len
        <PageLink key={middlePage} params={qsObject} page={middlePage} activePage={page}>
          <Pagination.Ellipsis />
        </PageLink>,
      );
    }
    if (page < pages - 2) {
      pageItems.push(
        <PageLink key={pages} params={qsObject} page={pages} activePage={page}>
          <Pagination.Item>{pages}</Pagination.Item>
        </PageLink>,
      );
    }
    if (page < pages) {
      pageItems.push(
        <PageLink key="next" params={qsObject} page={page + 1} activePage={0}>
          <Pagination.Next />
        </PageLink>,
      );
    }
    if (page !== Number.parseInt(pages, 10)) {
      pageItems.push(
        <PageLink key="last" params={qsObject} page={pages} activePage={0}>
          <Pagination.Last />
        </PageLink>,
      );
    }
    // The additive render could be removed by a shouldComponentUpdate Hook
    // But is it always an Optimization??
    // console.log("I am Rendering!", issues.length);
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
              <IssueFilter baseUrl="/issues" />
            </Card.Body>
          </Collapse>

        </Card>
        <IssueTable closeIssue={this.closeIssue} deleteIssue={this.deleteIssue} issues={issues} />
        <div className="d-flex justify-content-center">
          <Pagination>
            {pageItems}
          </Pagination>
        </div>
        <IssueDetail issue={selectedIssue} />
        {/* <Route path="/issues/:id" component={IssueDetail} /> */}
        {/* <div>
          <IssueAdd createIssue={this.createIssue} />
        </div> */}
      </>
    );
  }
}

const ToastedIssueList = withToast(IssueList);
ToastedIssueList.fetchData = IssueList.fetchData;

export default ToastedIssueList;
