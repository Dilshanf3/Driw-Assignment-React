export  async function getTotal(values) {
    
    const options = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    };
  
    fetch("http://localhost:8080/items/", false,options)
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
  