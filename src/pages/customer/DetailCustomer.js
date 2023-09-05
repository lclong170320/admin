import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import moment from "moment";

import Row from "react-bootstrap/Row";

import { useParams } from "react-router-dom";
import * as customerAPI from "../../api/customer";

// import { Link } from "react-router-dom";

function DetailCustomer() {
  const { customer_id } = useParams();
  const [customer, setCustomer] = useState({});
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await customerAPI.get(
        `customers?customer_id=${customer_id}`
      );
      setCustomer(data.customers[0]);
    };
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <div className="new-container">
      <div className="new-container-top">
        <span className="new-container-top__title">Detail customer</span>
      </div>
      <div className="new-container-bottom">
        <div className="new-container-bottom__left">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Customer name</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={customer.customer_name}
                  disabled
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Customer dob</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={moment(customer.customer_dob)
                    .utc()
                    .format("DD-MM-YYYY")}
                  disabled
                />
              </Form.Group>
            </Row>
            <Row className="mb-4">
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={customer.account?.username}
                  disabled
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  defaultValue={customer.account?.password}
                  disabled
                />
              </Form.Group>
            </Row>
            <Row className="mb-4">
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Create at</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={moment(customer.createdAt)
                    .utc()
                    .format("DD-MM-YYYY H:mm:ss")}
                  disabled
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Upload at</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={moment(customer.updatedAt)
                    .utc()
                    .format("DD-MM-YYYY H:mm:ss")}
                  disabled
                />
              </Form.Group>
            </Row>
            <Row className="mb-2">
              <Form.Label>
                <h6>Bạn có thể đặt lại mật khẩu thành 1</h6>
              </Form.Label>
            </Row>
            <Button type="submit">Cập nhật mật khẩu</Button>
          </Form>
        </div>
        <div className="new-container-bottom__right">
          <img
            className="new-container-bottom__right--img"
            src={`http://127.0.0.1:8081//${customer.customer_avata}`}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default DetailCustomer;
