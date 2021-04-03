import React from "react";
import store from "./store";
import graphQLFetch from "./graphQLFetch";

export default class About extends React.Component {
  static async fetchData() {
    const data = await graphQLFetch("query {about}");
    return data;
  }

  constructor() {
    super();
    this.state = {
      apiAbout: store.initialData ? store.initialData.about : null,
    };
    delete store.initialData;
  }

  componentDidMount() {
    const { apiAbout } = this.state;
    if (!apiAbout) {
      About.fetchData()
        .then((data) => this.setState({ apiAbout: data.about }))
        .catch((err) => { throw err; });
    }
  }

  render() {
    const { apiAbout } = this.state;
    return (
      <div className="text-center">
        <h3>Issue Tracker Version 2.0.22</h3>
        <h4>
          {apiAbout}
        </h4>
      </div>
    );
  }
}
