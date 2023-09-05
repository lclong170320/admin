import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Row from "react-bootstrap/Row";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as discountApi from "../../api/discount";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { Link } from "react-router-dom";

function UpdateDiscount() {
  //get product
  const { discount_id } = useParams();
  const [discountList, setDiscountList] = useState({});
  const [priceDiscount, setPriceDiscount] = useState(0);
  const [validated, setValidated] = useState(false);
  const [discountName, setDiscountName] = useState();
  const [percent, setPercent] = useState(0);
  const [discountStart, setDiscountStart] = useState();
  const [discountEnd, setDiscountEnd] = useState();

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await discountApi.get(`discount?discount_id=${discount_id}`);
      setDiscountList(data.discounts[0]);
      setDiscountName(data.discounts[0].discount_name);
      setPercent(data.discounts[0].discount_percent);
      setDiscountStart(data.discounts[0].discount_start);
      setDiscountEnd(data.discounts[0].discount_end);
    };
    fetchAPI();
  }, [discount_id]);

  let navigate = useNavigate();
  useEffect(() => {
    let discountSum =
      discountList.product?.product_price === undefined
        ? 0
        : parseInt(discountList.product?.product_price) -
          parseInt((percent * discountList.product?.product_price) / 100);
    setPriceDiscount(parseInt(discountSum));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent]);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      event.preventDefault();
      axios
        .put(`http://localhost:3000/discounts/${discount_id}`, {
          discount_id: discount_id,
          discount_name: discountName,
          discount_percent: percent,
          discount_start: discountStart,
          discount_end: discountEnd,
        })
        .then((res) => {
          toast("Update discount success", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate("/discounts/");
          }, 3000);
        })
        .catch((err) => {
          toast.error("Bạn nhập sai thông tin vui lòng nhập lại!");
        });
    }
  };

  return (
    <div className="new-container">
      <div className="new-container-top">
        <span className="new-container-top__title">
          Update discount product
        </span>
      </div>
      <div className="new-container-bottom">
        <div className="new-container-bottom__left">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  defaultValue={discountList.product?.product_name}
                  name="product_name"
                  placeholder="Product name"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Name discount</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name_discount"
                  placeholder="name discount"
                  defaultValue={discountName}
                  onChange={(e) => setDiscountName(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Discount percent </Form.Label>
                <Form.Control
                  required
                  type="number"
                  step="1"
                  min="1"
                  max="99"
                  name="percent"
                  placeholder="percent"
                  defaultValue={discountList.discount_percent}
                  onChange={(e) => setPercent(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Discount start</Form.Label>
                <Form.Control
                  required
                  type="date"
                  name="discount_start"
                  placeholder="Discount start"
                  defaultValue={moment(discountList.discount_start).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={(e) => setDiscountStart(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Discount end</Form.Label>
                <Form.Control
                  required
                  type="date"
                  name="discount end"
                  placeholder="Discount end"
                  defaultValue={moment(discountList.discount_end).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={(e) => setDiscountEnd(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  name="product_price"
                  placeholder="Price"
                  defaultValue={discountList.product?.product_price}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Price discount</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  name="product_price"
                  placeholder="Price"
                  value={priceDiscount}
                />
              </Form.Group>
            </Row>

            <Button type="submit">Lưu</Button>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
            />
          </Form>
        </div>
        <div
          className="new-container-bottom__right"
          style={{ marginTop: "80px" }}
        >
          <img
            className="new-container-bottom__right--img"
            src={`http://127.0.0.1:8081//${discountList.product?.images[0]?.image_name}`}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default UpdateDiscount;
