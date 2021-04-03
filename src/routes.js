import About from "./About.jsx";
import IssueEdit from "./issueEdit.jsx";
import IssueList from "./issuesList.jsx";
import IssuesReport from "./issuesReport.jsx";
import NotFound from "./NotFound.jsx";

const routes = [
  { path: "/issues/:id?", component: IssueList },
  { path: "/edit/:id", component: IssueEdit },
  { path: "/about", component: About },
  { path: "/report", component: IssuesReport },
  { path: "/*", component: NotFound },
];

export default routes;
