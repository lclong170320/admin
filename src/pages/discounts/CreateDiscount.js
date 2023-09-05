import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Row from "react-bootstrap/Row";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as productApi from "../../api/product";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { Link } from "react-router-dom";

function CreateDiscount() {
  //get product
  const { product_id } = useParams();
  const [productList, setProductList] = useState({});
  useEffect(() => {
    const fetchAPI = async () => {
      const data = await productApi.get(`products?product_id=${product_id}`);
      setProductList(data.products[0]);
    };
    fetchAPI();
  }, [product_id]);

  let navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [discountName, setDiscountName] = useState();
  const [percent, setPercent] = useState();
  const [discountStart, setDiscountStart] = useState();
  const [discountEnd, setDiscountEnd] = useState();

  const [errors, setErrors] = useState(false);

  const handleSubmit = async (event) => {
    const date = new Date();
    if (discountStart.toString() > date.toString()) {
      setErrors(true);
    }
    if (discountEnd.toString() > date.toString()) {
      setErrors(true);
    }
    if (discountStart < discountEnd) {
      setErrors(true);
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (form.checkValidity() === true && errors === false) {
      event.preventDefault();
      axios
        .post(`http://localhost:3000/discounts/`, {
          product_id: product_id,
          discount_name: discountName,
          discount_percent: percent,
          discount_start: discountStart,
          discount_end: discountEnd,
        })
        .then((res) => {
          toast.success("Create discount success", {
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
          toast.error("Create discount failed");
        });
    } else {
      event.preventDefault();
      toast.error("Create discount failed!");
    }
  };

  return (
    <div className="new-container">
      <div className="new-container-top">
        <span className="new-container-top__title">Add discount product</span>
      </div>
      <div className="new-container-bottom">
        <div className="new-container-bottom__left">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  defaultValue={productList.product_name}
                  name="product_name"
                  placeholder="Product name"
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom02">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  defaultValue={productList.category?.category_name}
                  name="product_name"
                  placeholder="Product name"
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
                  defaultValue={productList.product_price}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom04">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  disabled
                  type="text"
                  name="product_quantity"
                  placeholder="Quantity of product"
                  defaultValue={productList.storage?.product_quantity}
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
                  onChange={(e) => setDiscountName(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Discount percent </Form.Label>
                <Form.Control
                  required
                  type="number"
                  min="1"
                  max="99"
                  name="percent"
                  placeholder="percent"
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
                  onChange={(e) => setDiscountStart(e.target.value)}
                />
                {errors === true ? (
                  <Form.Control.Feedback type="invalid">
                    Please enter the correct date
                  </Form.Control.Feedback>
                ) : (
                  <></>
                )}
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Discount end</Form.Label>
                <Form.Control
                  required
                  type="date"
                  name="discount end"
                  placeholder="Discount end"
                  onChange={(e) => setDiscountEnd(e.target.value)}
                />
                {errors === true ? (
                  <Form.Control.Feedback type="invalid">
                    Please enter the correct date
                  </Form.Control.Feedback>
                ) : (
                  <></>
                )}
              </Form.Group>
            </Row>
            <Button type="submit">Lưu</Button>
            <ToastContainer
              position="top-right"
              autoClose={1000}
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
      </div>
    </div>
  );
}

export default CreateDiscount;
