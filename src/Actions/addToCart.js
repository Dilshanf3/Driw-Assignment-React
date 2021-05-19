export async function addToCart(itemName, id, amount) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  };

  fetch(
    "http://localhost:8080/items/calculate_price/single/" +
      itemName +
      "/" +
      id +
      "/" +
      amount,

    options
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something went wrong ...");
      }
    })
    .then((data) => {
      return data;
    })
    .catch((error) => console.log("error", error));
}
