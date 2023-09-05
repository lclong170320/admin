import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as orderApi from "../../api/order";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Image } from "react-bootstrap";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { Stepper, Step } from "react-form-stepper";
import moment from "moment";
import LoadPage from "../../components/loadpage/Loadpage";
function DetailOrder() {
  const { order_id } = useParams();
  const [order, setOrder] = useState();
  const [orderDetail, setOrderDetail] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAPI = async () => {
      const data = await orderApi.get(`order?order_id=${order_id}`);
      setOrder(data.orders[0]);
      setOrderDetail(data.orders[0].order_details);
      setOrderStatus(data.orders[0].order_statuses);
      setLoading(false);
    };
    fetchAPI();
  }, [order_id]);
  if (loading) return <LoadPage />;
  else
    return (
      <Container>
        <Row>
          <Col className="mt-2">
            {" "}
            <h5> Detail order {order?.order_id} </h5>
          </Col>
        </Row>
        <Row>
          <Col sm={7}>
            {orderDetail.map((orderDetail, index) => {
              return (
                <Row style={{ borderTop: "1px solid black" }}>
                  <Col sm={3} className="mt-2">
                    <Image
                      style={{ width: "100%", height: "80%" }}
                      src={`http://127.0.0.1:8081//${orderDetail.product.images[0].image_name}`}
                      alt="Lỗi"
                    ></Image>
                  </Col>
                  <Col sm={6} style={{ fontSize: "18px" }}>
                    {" "}
                    {orderDetail.product.product_name}
                  </Col>

                  <Col sm={3}>
                    <div>
                      <span>
                        Price:{" "}
                        {orderDetail.detail_price.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    <br />
                    <div>
                      <span>Amount: {orderDetail.detail_quantity}</span>
                    </div>
                  </Col>
                </Row>
              );
            })}
          </Col>
          <Col sm={5} style={{ borderLeft: "1px solid black" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h5> Billing information </h5>
              <FaFileInvoiceDollar size={30} />
            </div>
            <div>
              <h6>
                {" "}
                Order payment:{" "}
                <span style={{ color: "#666666" }}>
                  {order?.order_payment}{" "}
                  {order?.order_payment === "Thanh toán online"
                    ? "(đã thanh toán)"
                    : ""}{" "}
                </span>
              </h6>
            </div>
            <br />
            <div>
              <h6>
                {" "}
                Customer:{" "}
                <span style={{ color: "#666666" }}>{order?.customer_id} </span>
              </h6>
            </div>
            <br />
            <div>
              <h6>
                {" "}
                Address:{" "}
                <span style={{ color: "#666666" }}>{order?.address} </span>
              </h6>
            </div>
            <br />
            <div>
              <h6>
                {" "}
                Node:{" "}
                <span style={{ color: "#666666" }}>{order?.order_note} </span>
              </h6>
            </div>
            <br />
            <div>
              <h6>
                {" "}
                Date created:{" "}
                <span style={{ color: "#666666" }}>
                  {moment(order?.createdAt).utc().format("DD-MM-YYYY H:mm:ss")}{" "}
                </span>
              </h6>
            </div>
            <br />
            <div>
              <h6>
                Order total:{" "}
                <span style={{ color: "red" }}>
                  {order?.order_total.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>{" "}
              </h6>
            </div>
          </Col>
        </Row>
        <Row style={{ borderTop: "1px solid black" }}>
          <Col className="mt-2" sm={12}>
            {" "}
            <h5> Status order </h5>
          </Col>
          <Col className="mt-2" sm={12}>
            <Stepper activeStep={orderStatus.length - 1}>
              {orderStatus.map((orderStatus, index) => {
                const status =
                  orderStatus.status +
                  " ngày " +
                  moment(orderStatus.createdAt)
                    .utc()
                    .format("DD-MM-YYYY H:mm:ss");
                return <Step key={index} label={status} />;
              })}
            </Stepper>
          </Col>
        </Row>
      </Container>
    );
}

export default DetailOrder;
