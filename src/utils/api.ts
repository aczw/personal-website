// see https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript
const api = async <T>(url: string): Promise<T> => {
  return await fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return res.json() as Promise<T>;
    })
    .then((data) => data);
};

export default api;
