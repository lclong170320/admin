import React, { useState, useEffect } from "react";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Row from "react-bootstrap/Row";
import moment from "moment";
import { useParams } from "react-router-dom";
import * as productApi from "../../api/product";

// import { Link } from "react-router-dom";

function UploadProduct() {
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

  const [files, setFiles] = useState();
  useEffect(() => {
    setFiles(productList.images);
  }, [productList]);

  const filesLength = [];
  if (files) {
    for (let i = 0; i < files.length; i++) {
      filesLength.push(files[i]);
    }
  }

  return (
    <div className="new-container">
      <div className="new-container-top">
        <span className="new-container-top__title">Detail Product</span>
      </div>
      <div className="new-container-bottom">
        <div className="new-container-bottom__left">
          <Row className="mb-3">
            <Form.Group as={Col} md="5" controlId="validationCustom01">
              <Form.Label>Product name</Form.Label>
              <Form.Control
                disabled
                type="text"
                defaultValue={productList.product_name || ""}
              />
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="validationCustom02">
              <Form.Label>Category</Form.Label>
              <Form.Control
                disabled
                type="text"
                defaultValue={productList.category?.category_name || ""}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="5" controlId="validationCustom03">
              <Form.Label>Price</Form.Label>
              <Form.Control
                disabled
                type="text"
                value={productList.product_price || ""}
                name="product_price"
                placeholder="Price"
              />
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="validationCustom04">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                disabled
                type="text"
                value={productList.storage?.product_sold || ""}
                name="product_quantity"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="5" controlId="validationCustom03">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                disabled
                type="text"
                value={productList.storage?.product_quantity || ""}
              />
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="validationCustom04">
              <Form.Label>Sold</Form.Label>
              <Form.Control
                disabled
                type="text"
                value={productList.storage?.product_sold || ""}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="5" controlId="validationCustom03">
              <Form.Label>Create at</Form.Label>
              <Form.Control
                disabled
                type="text"
                defaultValue={moment(productList.createdAt)
                  .utc()
                  .format("DD-MM-YYYY H:mm:ss")}
              />
            </Form.Group>
            <Form.Group as={Col} md="5" controlId="validationCustom04">
              <Form.Label>Update at</Form.Label>
              <Form.Control
                disabled
                type="text"
                defaultValue={moment(productList.updatedAt)
                  .utc()
                  .format("DD-MM-YYYY H:mm:ss")}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="10" controlId="validationCustom03">
              <Form.Label>Provider</Form.Label>
              <Form.Control
                disabled
                type="text"
                value={productList.provider || ""}
                name="provider"
              />
            </Form.Group>
          </Row>
          <Row className="mb-2">
            <Form.Group
              style={{ width: "83%" }}
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Describe</Form.Label>
              <Form.Control
                disabled
                value={productList.product_describe || ""}
                as="textarea"
                rows={5}
              />
            </Form.Group>
          </Row>
        </div>
        <div className="new-container-bottom__right">
          {files ? (
            <Row className="new-container-bottom__right--img--des">
              {filesLength.map((filesLength, index) => (
                <Col
                  xs={4}
                  key={index}
                  className="new-container-bottom__right--img--des-col"
                  style={{ margin: "auto", width: "50%" }}
                >
                  <img
                    className="new-container-bottom__right--img--des-col-img"
                    src={
                      files
                        ? `http://127.0.0.1:8081//${files[index].image_name}`
                        : ""
                    }
                    alt=""
                  />
                </Col>
              ))}
            </Row>
          ) : (
            "Lỗi hình ảnh"
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadProduct;
