import Chart from "../../components/chart/Chart";
import Featured from "../../components/featured/Featured";
import Widget from "../../components/widget/Widget";
import "./home.css";
import { useState, useEffect } from "react";
import * as orderApi from "../../api/order";
import * as userApi from "../../api/customer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    const fetchAPI = async () => {
      const data = await orderApi.get("orders");
      const dataUser = await userApi.get("customers");
      setOrders(data.orders);
      setOrderCount(data.rows_count);
      setUserCount(dataUser.rows_count);
    };
    fetchAPI();
  }, []);
  let total = 0;
  if (orders) {
    orders.map((item) => {
      return (total += item.order_total);
    });
  }
  return (
    <>
      <div className="widgets">
        <Widget type="user" check={userCount} />
        <Widget type="order" check={orderCount} />
        <Widget type="earning" check={total} />
        <Widget type="balance" check="1" />
      </div>
      <div className="charts">
        <Featured />
        <Chart />
      </div>
      <ToastContainer />
      <br />
      <br />
      <br />
    </>
  );
}

export default Home;
