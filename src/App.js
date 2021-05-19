import React, { useEffect, useState, Text } from "react";
import "./App.css";
import { useForm } from "react-cool-form";
import "./styles.scss";
import { Button, Card } from "react-bootstrap";
import { getItemList } from "./Actions/getItemListAction";
import { addItems } from "./Actions/addItems";

function App() {
  const [items, setItems] = useState([]);
  const [singleValue, setSingleValue] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [total, setTotal] = useState(0);
  const [singleAmount, setSingleAmount] = useState(0);
  const [cartonAmount, setCartonAmount] = useState(0);
  const [showPrices, setShowPrices] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getItems();
  }, []);
  const scrollTo = (ref) => {
    if (ref /* + other conditions */) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  //Form
  const { form, mon } = useForm(
    {
      onSubmit: (values) => addItem(values),
    }
    // eslint-disable-next-line no-undef
  );

  //get Items
  async function getItems() {
    console.log("await getItemList()", await getItemList());
    setItems(await getItemList());
  }

  //add items into databse
  async function addItem(values) {
    await addItems(values);
    await getItems();
  }

  function availableItems(value) {
    var index = cartItems.findIndex((item) => item.itemId === value.itemId);
    // here you can check specific property for an object whether it exist in your array or not
    index === -1
      ? setCartItems([...cartItems, value])
      : setCartItems(
          cartItems.map((item) =>
            item.itemId === value.itemId
              ? { ...item, price: value.price }
              : item
          )
        );
  }

  const errors = mon("errors");

  //update Array for get total price
  async function updateArray(id, amount) {
    var index = singleValue.findIndex((item) => item.itemId === id);
    index === -1
      ? await setSingleValue([...singleValue, { itemId: id, amount: amount }])
      : await setSingleValue(
          singleValue.map(
            (item) => (item.itemId === id ? { ...item, amount: amount } : item),
            function test() {
              console.log("singleValue", singleValue);
            }
          )
        );
    if (singleValue !== []) {
      setShowPrices(true);
    }

    getTotalValue();
  }

  //add  data in to shoppingcart
  async function addToCart(id, noOfUnitsInCartoon, itemName) {
    var amount;
    if (singleAmount !== 0 && cartonAmount !== 0) {
      amount = singleAmount + cartonAmount * noOfUnitsInCartoon; //10
      updateArray(id, amount);
    } else if (singleAmount !== 0 && cartonAmount === 0) {
      amount = singleAmount; //10
      setSingleValue([...singleValue, { itemId: id, amount: amount }]);
      updateArray(id, amount);
    } else if (singleAmount === 0 && cartonAmount !== 0) {
      amount = cartonAmount * noOfUnitsInCartoon; //10
      setSingleValue([...singleValue, { itemId: id, amount: amount }]);
      updateArray(id, amount);
    }
   
if(singleAmount !==0 && cartonAmount!==0){
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
      .then((data) => availableItems(data, id, amount))
      .catch((error) => this.setState({ error }));
    }
    else{
      alert("Please input a valid items")
    }
  }

  //function to get total value
  function getTotalValue() {
    //getTotal(singleValue);
    const options = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(singleValue),
    };

    fetch("http://localhost:8080/items/calculate_price/all", options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .then((data) => {
        setTotal(data.price);
      })
      .catch((error) => console.log("error", error));
  }

  //main render method
  return (
    <>
      <div style={{ height: 50 }}>
        <h1 style={{ textAlign: "center", color: "white" }}>
          Shopping Cart and calculator
        </h1>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridGap: 20,
        }}
      >
        <div style={{ height: 700 }}>
          <h1 style={{ textAlign: "center", color: "white" }}>Admin panel</h1>
          <form
            id="create-course-form"
            ref={form}
            noValidate
            style={{ marginTop: 10 }}
          >
            <div>
              <input name="itemName" placeholder="Item Name" required />
              {errors.itemName && <p>{errors.itemName}</p>}
            </div>
            <div>
              <input
                name="priceOFSingleCartoon"
                placeholder="Carton price"
                required
              />
              {errors.priceOFSingleCartoon && (
                <p>{errors.priceOFSingleCartoon}</p>
              )}
            </div>
            <div>
              <input
                name="noOfUnitsInCartoon"
                placeholder="Units per carton"
                required
              />
              {errors.noOfUnitsInCartoon && <p>{errors.noOfUnitsInCartoon}</p>}
            </div>
            {/* <div>
              <input
                name="discountPrecentage"
                placeholder="Discount percentage"
                required
              />
              {errors.discountPrecentage && <p>{errors.discountPrecentage}</p>}
            </div> */}
            <div>
              <input
                name="minCartoonAmountToDiscount"
                placeholder="Minimum carton amount to apply discount"
                required
              />
              {errors.minCartoonAmountToDiscount && (
                <p>{errors.minCartoonAmountToDiscount}</p>
              )}
            </div>
            {/* <div>
              <input
                name="singleItemPercentage"
                placeholder="Percentage that apply single item purchase"
                required
              />
              {errors.singleItemPercentage && (
                <p>{errors.singleItemPercentage}</p>
              )}
            </div> */}

            <input type="submit" />
          </form>
        </div>
        <div style={{ height: 500 }}>
          <h1 style={{ textAlign: "center", color: "white" }}>List items</h1>

          <ul className="grid_list" ref={scrollTo}>
            {items.map((item, index) => (
              <Card
                style={{
                  backgroundColor: "black",
                  height: 320,
                }}
              >
                <Card.Body
                  style={{
                    backgroundColor: "white",
                    width: 300,
                    height: 300,
                    borderWidth: 1,
                    borderColor: "thistle",
                    borderRadius: 5,
                    marginLeft: 2,
                  }}
                >
                  <Card.Title
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    Item Name :{item.itemName}
                  </Card.Title>
                  <Card.Title style={{ fontWeight: "bold" }}>
                    Carton price:{item.priceOFSingleCartoon}
                  </Card.Title>
                  <Card.Title style={{ fontWeight: "bold" }}>
                    Units in Carton:{item.noOfUnitsInCartoon}
                  </Card.Title>
                  <Card.Text style={{ fontWeight: "inherit" }}>
                    <ul>
                      <li>
                        If you purchased 3 carton or more, you will receive 10%
                        discount off the carton price
                      </li>
                    </ul>
                  </Card.Text>
                  <div style={{ marginLeft: 5 }}>
                    <input
                      onFocus={() => setSelectedItem(item.id)}
                      min="1"
                      type="number"
                      placeholder="Carton"
                      style={{ width: 200, height: 20 }}
                      onChange={(e) => {
                        setCartonAmount(Number(e.target.value));
                        // setCartonValue([
                        //   { itemId: item.id, amount: Number(e.target.value) },
                        // ]);
                      }}
                    />
                  </div>
                  <div style={{ marginLeft: 5 }}>
                    <input
                      min="1"
                      onFocus={() => setSelectedItem(item.id)}
                      type="number"
                      placeholder="Single"
                      style={{ width: 200, height: 20 }}
                      //onChange={handleChange(item.id,index)}
                      onChange={(e) => {
                        setSingleAmount(Number(e.target.value));
                        // setSingleValue([
                        //   { itemId: item.id, amount: Number(e.target.value) },
                        // ]);
                      }}
                    />
                  </div>
                  <div style={{ marginLeft: 5, marginTop: 5 }}>
                    <Button
                      disabled={item.id !== selectedItem}
                      style={{
                        backgroundColor: "#0971f1",
                        marginLeft: 1,
                        height: 30,
                        width: 208,
                      }}
                      onClick={() =>
                        addToCart(
                          item.id,
                          // (singleValue[0].amount),
                          // cartonValue[0].amount * item.noOfUnitsInCartoon,
                          item.noOfUnitsInCartoon,
                          item.itemName
                        )
                      }
                    >
                      Add to cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </ul>
        </div>

        {showPrices ? (
          <div style={{ height: 500 }}>
            <h1 style={{ textAlign: "center", color: "white" }}>
              Shopping cart
            </h1>

            {showPrices ? (
              <h2 style={{ textAlign: "center", color: "white" }}>
                Total Price{total.toFixed(2)}
              </h2>
            ) : null}
            <Button
              style={{
                backgroundColor: "#0971f1",
                marginLeft: 20,
                height: 30,
                width: 300,
              }}
              onClick={() => getTotalValue()}
            >
              Get total
            </Button>

            <table
              style={{ backgroundColor: "white", width: 350, marginTop: 10 }}
            >
              <thead>
                <tr>
                  <th style={{ width: 10, textAlign: "left" }}>Item</th>
                  <th style={{ width: 10, textAlign: "left" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((items, i) => (
                  <TableRow key={i} data={items} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
class TableRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.data.itemName}</td>
        <td>{this.props.data.price.toFixed(2)}</td>
      </tr>
    );
  }
}
export default App;
