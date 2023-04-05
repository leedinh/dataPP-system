export const KEY_ACCESS_TOKEN = "accessToken";

export const postData = (path: string, body: any) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  return fetch(path, requestOptions);
};

export const postDataAuthorization = (path: string, body: any) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem(KEY_ACCESS_TOKEN)}`,
    },
    body: JSON.stringify(body),
  };

  return fetch(path, requestOptions);
};

export const uploadFile = (path: string, file: FormData) => {
  const requestOptions = new Request(path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(KEY_ACCESS_TOKEN)}`,
    },
    body: file,
  });

  return fetch(requestOptions);
};
