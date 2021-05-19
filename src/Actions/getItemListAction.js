export async function getItemList() {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  };

  return await fetch("http://localhost:8080/items/", options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something went wrong ...");
      }
    })
    .then((data) => {
        console.log("Fff",data)
      return data;
    })
    .catch((error) => console.log("error", error));
}

