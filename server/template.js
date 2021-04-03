import serialize from "serialize-javascript";

export default function template(body, initialData, userData) {
  return `
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Professional MERN Stack- Example 2</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        #second-navigation-dropdown::after, #second-navigation-dropdown::before {
            border: none;
        }

        tr.active {
            background-color: lightgrey;
        }
        
    </style>
    <script src="https://apis.google.com/js/api:client.js"></script>
    <script src="/venodrs.bundle.js"></script>
</head>
<body>

    <div id="content">${body}</div>
    <script src="/env.js"></script>
    <script>
    window.__INITIAL_DATA__=${serialize(initialData)};
    window.__USER_DATA__=${serialize(userData)};
    </script>
  
  <script src="/app.bundle.js"></script>
</body>
</html>
    `;
}
