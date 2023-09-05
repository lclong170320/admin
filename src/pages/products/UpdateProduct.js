import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Row from "react-bootstrap/Row";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as categoryApi from "../../api/category";
import * as productApi from "../../api/product";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Link } from "react-router-dom";

function UploadProduct() {
  //get category
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchAPI = async () => {
      const data = await categoryApi.get("categories");
      setCategories(data.categories);
    };
    fetchAPI();
  }, []);
  //get product
  const { product_id } = useParams();
  const [productList, setProductList] = useState({});
  const [check, setCheck] = useState(false);
  useEffect(() => {
    const fetchAPI = async () => {
      const data = await productApi.get(`products?product_id=${product_id}`);
      setProductList(data.products[0]);
      setCheck(true);
    };
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [files, setFiles] = useState();
  const [newFiles, setNewFiles] = useState();
  const [productName, setProductName] = useState();
  const [categoryId, setCategoryId] = useState();
  const [describe, setDescribe] = useState();
  const [price, setPrice] = useState();
  const [provider, setProvider] = useState();
  const [quantity, setQuantity] = useState();

  useEffect(() => {
    setFiles(productList.images);
    setProductName(productList.product_name);
    setCategoryId(productList.category?.category_id);
    setDescribe(productList.product_describe);
    setPrice(productList.product_price);
    setProvider(productList.provider);
    setQuantity(productList.storage?.product_quantity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [check]);

  let newCategories = [];
  if (categories && categoryId) {
    newCategories = categories.filter(
      (item) => item.category_id !== categoryId
    );
  }

  const filesLength = [];
  if (files) {
    for (let i = 0; i < files.length; i++) {
      filesLength.push(files[i]);
    }
  }
  const newFilesLength = [];
  if (newFiles) {
    for (let i = 0; i < newFiles.length; i++) {
      newFilesLength.push(newFiles[i]);
    }
  }

  const formData = new FormData();

  formData.append("product_name", productName);
  formData.append("category_id", categoryId);
  formData.append("product_describe", describe);
  formData.append("product_price", price);
  formData.append("provider", provider);
  formData.append("product_quantity", quantity);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (newFiles) {
      Object.values(newFiles).forEach((file) => {
        formData.append("product_img", file);
      });
    }
    Object.values(files).forEach((file) => {
      formData.append("product_img", file);
    });
    if (form.checkValidity() === true) {
      event.preventDefault();
      axios
        .put(`http://localhost:3000/products/${product_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          toast.success("Update product success", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate("/products/");
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Update product failed");
        });
    }
  };

  return (
    <div className="new-container">
      <div className="new-container-top">
        <span className="new-container-top__title">Upload Product</span>
      </div>
      <div className="new-container-bottom">
        <div className="new-container-bottom__left">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={productName || ""}
                  name="product_name"
                  placeholder="Product name"
                  onChange={(e) => setProductName(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom02">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category_id"
                  onChange={(e) => setCategoryId(e.target.value)}
                  aria-label="Floating label select example"
                >
                  <option value={productList.category?.category_id}>
                    {productList.category?.category_name}
                  </option>
                  {newCategories.map((category, index) => {
                    return (
                      <option key={index} value={category.category_id}>
                        {category.category_name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={price || ""}
                  name="product_price"
                  placeholder="Price"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom04">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={quantity || ""}
                  name="product_quantity"
                  placeholder="Quantity of product"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="10" controlId="validationCustom03">
                <Form.Label>Provider</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={provider || ""}
                  name="provider"
                  placeholder="provider"
                  onChange={(e) => setProvider(e.target.value)}
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
                  name="product_describe"
                  value={describe || ""}
                  onChange={(e) => setDescribe(e.target.value)}
                  as="textarea"
                  rows={5}
                />
              </Form.Group>
            </Row>
            <Form.Group as={Col} md="7" className="position-relative mb-4">
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                id="file"
                name="product_img"
                multiple
                accept="image/*"
                onChange={(e) => {
                  setNewFiles(e.target.files);
                }}
              />
            </Form.Group>
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
        <div className="new-container-bottom__right">
          <div>
            <h6>Img new</h6>
          </div>
          {newFiles ? (
            <Row className="new-container-bottom__right--img--des">
              {newFilesLength.map((newFilesLength, index) => (
                <Col
                  xs={4}
                  key={index}
                  className="new-container-bottom__right--img--des-col"
                >
                  <img
                    className="new-container-bottom__right--img--des-col-img"
                    src={
                      newFiles
                        ? URL.createObjectURL(newFiles[index])
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8-e9Jpr1AyNwkdf_iE_zQjknFwrn3kBbQQ&usqp=CAU"
                    }
                    alt=""
                  />
                </Col>
              ))}
            </Row>
          ) : (
            "Bạn chưa upload ảnh mới"
          )}
          <br />
          <br />
          <h6>Old img </h6>
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
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadProduct;
