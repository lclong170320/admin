import "./featured.css";
import { AiOutlineMore } from "react-icons/ai";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import * as orderApi from "../../api/order";
function Featured() {
  const [orders, setOrders] = useState([]);

  let target = 10000000;
  let total = 0;
  const date = new Date();
  useEffect(() => {
    const fetchAPI = async () => {
      const data = await orderApi.get("order?created_at=1");
      setOrders(data.orders);

    };
    fetchAPI();
  }, []);
  if (orders) {
    orders.map((item) => {
      return (total += item.order_total);
    });
  }

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue </h1>
        <AiOutlineMore />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar
            value={(total / target) * 100}
            text={((total / target) * 100).toFixed(2)}
            strokeWidth={3}
          />
        </div>
        <p className="tile">
          Total sales made date {date.getDate()}/{date.getMonth()+1} <br /> Target:{" "}
          {target.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          })}
        </p>
        <p className="amount">
          {total.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      </div>
    </div>
  );
}

export default Featured;
