import React from "react";
import * as orderApi from "../../api/order";
import { useState, useEffect } from "react";
// import Loadpage from "../../loadpage/Loadpage";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { BiDetail } from "react-icons/bi";
import { AiTwotoneDelete } from "react-icons/ai";
import moment from "moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Form from "react-bootstrap/Form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CheckPagination from "../../components/Pagination/CheckPagination";
import LoadPage from "../../components/loadpage/Loadpage";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkOrder, setCheckOrder] = useState(true);
  const [checkOrderStatus, setCheckOrderStatus] = useState();
  const [checkOrderTotal, setCheckOrderTotal] = useState();
  const [checkPayment, setCheckPayment] = useState();
  useEffect(() => {
    const fetchAPI = async () => {
      let data = {};

      if (checkOrderTotal !== undefined) {
        data = await orderApi.get(
          `orders?order_total=${checkOrderTotal}&limit=999999`
        );
      } else if (checkPayment !== undefined) {
        data = await orderApi.get(
          `orders?order_payment=${checkPayment}&limit=999999`
        );
      } else {
        data = await orderApi.get("orders?limit=999999");
      }
      setOrders(data.orders);
      setCheckOrder(false);
      setLoading(false);
    };
    fetchAPI();
  }, [checkOrder, checkOrderStatus, checkOrderTotal, checkPayment]);

  const deleteOrder = (user_id) => {
    const agreeDelete = window.confirm(`bạn có muốn xóa user_id: ${user_id}`);
    if (agreeDelete) {
      window.alert(`Bạn đã xóa thành công user_id:  ${user_id}`);
    }
    return 0;
  };

  const statusOrder = (status, order_id) => {
    console.log("a");
    const agreeDelete = window.confirm(
      `Do you want to update your order status ?`
    );
    if (agreeDelete) {
      axios
        .put(
          `http://localhost:3000/orders/status/${order_id}`,
          {
            status: status,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res) {
            toast.success(`Update status successful`, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((err) => {
          if (err) {
            toast.error(`Update status fail`, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          }
        });
      setCheckOrder(false);
    }
    return 0;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);
  // Get current
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const current = orders.slice(indexOfFirst, indexOfLast);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateNext = () => setCurrentPage(currentPage + 1);
  const paginatePrev = () => setCurrentPage(currentPage - 1);

  if (loading) return <LoadPage />;
  else
    return (
      <div className="data-table">
        <div className="data-table__heading">
          <span className="data-table__title">Order</span>

          <Form.Select
            onChange={(e) => setCheckPayment(e.target.value)}
            className="mt-2"
            size="sm"
            style={{ width: "20%" }}
          >
            <option value="">Search by payment order </option>
            <option value="Trực Tiếp">Direct payment</option>
            <option value="Thanh toán online">Online payment</option>
          </Form.Select>
          <Form.Select
            onChange={(e) => setCheckOrderTotal(e.target.value)}
            className="mt-2"
            size="sm"
            style={{ width: "20%" }}
          >
            <option value="">Search by total order </option>
            <option value="1">Nhỏ hơn 100.000 </option>
            <option value="2">100.000 đến 500.000 </option>
            <option value="3">500.000 đến 1.000.000</option>
            <option value="4"> Lớn hơn 1.000.000</option>
          </Form.Select>
          <Form.Select
            onChange={(e) => setCheckOrderStatus(e.target.value)}
            className="mt-2"
            size="sm"
            style={{ width: "20%" }}
          >
            <option value="">Search by status order </option>
            <option value="Chưa xác nhận">Chưa xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đã giao hàng">Đã giao hàng</option>
            <option value="Huỷ đơn">Huỷ đơn</option>
          </Form.Select>
        </div>
        <Table bordered>
          <thead>
            <tr>
              <td>Id order</td>
              <td>Total</td>
              <td>Payment</td>
              <td>Update status</td>
              <td>Date created</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {current.map((order, index) => {
              return order.order_statuses[order.order_statuses.length - 1]
                ?.status === checkOrderStatus || !checkOrderStatus ? (
                <tr key={index}>
                  <td>{order.order_id}</td>
                  <td>
                    {order.order_total.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>{order.order_payment}</td>
                  <td style={{ width: "20%" }}>
                    <Form.Select
                      onChange={(e) =>
                        statusOrder(e.target.value, order.order_id)
                      }
                      aria-label="Default select example"
                      style={{ fontSize: "16px", width: "80%" }}
                    >
                      {order.order_statuses[order.order_statuses.length - 1]
                        ?.status === "Huỷ đơn" ? (
                        <>
                          <option disabled>Chưa xác nhận</option>
                          <option disabled value="Đã xác nhận">
                            Đã xác nhận
                          </option>
                          <option disabled value="Đã giao hàng">
                            Đã giao hàng
                          </option>
                          <option selected value="Huỷ đơn" disabled>
                            Huỷ đơn hàng
                          </option>
                        </>
                      ) : (
                        <></>
                      )}
                      {order.order_statuses[order.order_statuses.length - 1]
                        ?.status === "Chưa xác nhận" ? (
                        <>
                          <option selected>Chưa xác nhận</option>
                          <option value="Đã xác nhận">Đã xác nhận</option>
                          <option value="Huỷ đơn" style={{ color: "red" }}>
                            Huỷ đơn hàng
                          </option>
                        </>
                      ) : (
                        <></>
                      )}
                      {order.order_statuses[order.order_statuses.length - 1]
                        ?.status === "Đã xác nhận" ? (
                        <>
                          <option disabled>Chưa xác nhận</option>
                          <option selected disabled>
                            Đã xác nhận
                          </option>
                          <option value="Đã giao hàng">Đã giao hàng</option>
                          <option disabled>Huỷ đơn hàng</option>
                        </>
                      ) : (
                        <></>
                      )}
                      {order.order_statuses[order.order_statuses.length - 1]
                        ?.status === "Đã giao hàng" ? (
                        <>
                          <option disabled>Chưa xác nhận</option>
                          <option disabled>Đã xác nhận</option>
                          <option selected disabled>
                            Đã giao hàng
                          </option>
                          <option disabled>Huỷ đơn hàng</option>
                        </>
                      ) : (
                        <></>
                      )}
                    </Form.Select>
                  </td>
                  <td>
                    {moment(order.createdAt).utc().format("DD-MM-YYYY H:mm:ss")}
                  </td>
                  <td style={{ width: "10%" }}>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">Detail</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Link to={`/orders/detail-order/${order.order_id}`}>
                          <Button variant="outline-success">
                            <BiDetail />
                          </Button>
                        </Link>
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">Delete</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Button
                          style={{ marginLeft: "6px" }}
                          variant="outline-danger"
                          onClick={() => deleteOrder(order.order_id)}
                        >
                          <AiTwotoneDelete />
                        </Button>
                      </span>
                    </OverlayTrigger>
                  </td>
                </tr>
              ) : (
                <></>
              );
            })}
          </tbody>
        </Table>
        {orders.length > 7 ? (
          <CheckPagination
            postsPerPage={perPage}
            totalPosts={orders.length}
            paginate={paginate}
            paginateNext={paginateNext}
            paginatePrev={paginatePrev}
          />
        ) : (
          <></>
        )}

        <ToastContainer />
      </div>
    );
}

export default Order;
