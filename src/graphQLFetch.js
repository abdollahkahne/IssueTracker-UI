/* eslint-disable no-alert */

import fetch from "isomorphic-fetch";

const dateRegExp = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");

function isoDateReviver(key, value) {
  if (dateRegExp.test(value)) {
    // return new Intl.DateTimeFormat("en-GB").format(new Date(value))
    return new Date(value);
  }
  return value;
}

// eslint-disable-next-line consistent-return
export default async function graphQLFetch(
  query, variables = {}, showErrorCallBack = null, cookies = null,
) {
  try {
    const headers = cookies ? {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: cookies,
    } : {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // eslint-disable-next-line no-undef
    const apiEndPoint = (__isBrowser__)
      ? window.ENV.UI_API_ENDPOINT : process.env.UI_SERVER_API_ENDPOINT;
    const response = await fetch(apiEndPoint, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ query, variables }),
    });
    const responseText = await response.text();
    const result = JSON.parse(responseText, isoDateReviver);
    // In case of 200 OK if it have an error it packed it On errors.
    // But in case of Other code it has an error which handled in catch section
    if (result.errors) {
      const error = result.errors[0].extensions;
      if (error.code === "BAD_USER_INPUT") {
        if (showErrorCallBack) {
          showErrorCallBack(`${result.errors[0].message}:${error.errors.join("-")}`);
        }
      } else if (showErrorCallBack) {
        showErrorCallBack(`${error.code}:${result.errors[0].message}`);
      }
    }
    return result.data;
  } catch (e) {
    // console.log(e);
    if (e.errors) {
      const error = e.errors[0];
      if (showErrorCallBack) {
        showErrorCallBack(`${error.extensions.code}: ${error.message}`);
        return new Promise((resove, reject) => { reject(error); });
      }
    } else if (showErrorCallBack) {
      showErrorCallBack(e);
      return new Promise((resove, reject) => { reject(e); });
    }
  }
}
