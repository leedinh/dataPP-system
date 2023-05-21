export const KEY_ACCESS_TOKEN = "accessToken";
const API_URL = process.env.REACT_APP_API_URL;

export const uploadFile = (path: string, file: FormData) => {
  const requestOptions = new Request(API_URL + path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(KEY_ACCESS_TOKEN)}`,
    },
    body: file,
  });
  return fetch(requestOptions).then((res) => fetchHandler(res));
};

export const sendRequest = (
  method: string,
  path: string,
  body: any,
  auth?: boolean
) => {
  const requestOptions = new Request(path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let accessToken = localStorage.getItem(KEY_ACCESS_TOKEN);

  if (auth && !!accessToken) {
    requestOptions.headers.append("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(requestOptions).then((res) => fetchHandler(res));
};

export const sendGetRequest = (path: string, auth?: boolean) => {
  const requestOptions = new Request(API_URL + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let accessToken = localStorage.getItem(KEY_ACCESS_TOKEN);

  if (auth && !!accessToken) {
    requestOptions.headers.append("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(requestOptions).then((res) => fetchHandler(res));
};

const fetchHandler = (res: any) => {
  if (!res.ok) {
    // console.log(res);
    return Promise.reject(new Error(res.statusText));
  }
  return res;
};
