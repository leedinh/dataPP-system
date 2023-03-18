export const fetchData = async (body: any) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  return await fetch("http://127.0.0.1:5000/api/login", requestOptions);
};
