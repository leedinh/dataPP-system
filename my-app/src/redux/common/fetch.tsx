export const fetchData = (path: string, body: any) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  return fetch(path, requestOptions);
};
