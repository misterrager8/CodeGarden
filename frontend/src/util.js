export const api = (url, params, callback) =>
  fetch("/" + url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => callback(data));