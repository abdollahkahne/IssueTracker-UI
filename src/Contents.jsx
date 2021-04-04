/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import {
  Switch, Route, Redirect,
} from "react-router-dom";
// import IssueList from "./issuesList.jsx";
// import IssuesReport from "./issuesReport.jsx";
// import IssueEdit from "./issueEdit.jsx";
// import About from "./About.jsx";
import routes from "./routes";

export default function Contents() {
  return (
    <Switch>
      {routes.map((route) => <Route {...route} key={route.path} />)}
      <Redirect exact from="/" to="/issues" />
    </Switch>
  );
}
