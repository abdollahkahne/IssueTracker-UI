/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import {
  Switch, Route,
} from "react-router-dom";
import { Redirect } from "react-router";
// import IssueList from "./issuesList.jsx";
// import IssuesReport from "./issuesReport.jsx";
// import IssueEdit from "./issueEdit.jsx";
// import About from "./About.jsx";
import routes from "./routes";

export default function Contents() {
  return (
    <Switch>
      <Redirect exact from="/" to="/issues" />
      {routes.map((route) => <Route {...route} key={route.path} />)}
    </Switch>
  );
}
