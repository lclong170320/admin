import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Row from "react-bootstrap/Row";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

// import { Link } from "react-router-dom";

function CreateCategory() {
  let navigate = useNavigate();
  const [file, setFile] = useState("");

  const [validated, setValidated] = useState(false);

  const [data, setData] = useState({
    category_name: "",
    category_img: "",
  });

  const changeHandler = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };
  const changeHandlerFile = (e) => {
    const newData = { ...data };
    newData[e.target.name] = e.target.files[0];
    setData(newData);
  };
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
        .post(
          `http://localhost:3000/categories/`,
          {
            category_name: data.category_name,
            category_img: data.category_img,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          toast.success("Create category success", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate("/categories/");
          }, 3000);
        })
        .catch((err) => {
          toast.error("Create category failed");
        });
    }
  };

  return (
    <div className="new-container">
      <div className="new-container-top">
        <span className="new-container-top__title">Add Category</span>
      </div>
      <div className="new-container-bottom">
        <div className="new-container-bottom__left">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Form.Group
                as={Col}
                style={{ width: "60%" }}
                md="7"
                controlId="validationCustom01"
              >
                <Form.Label>Category name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="category_name"
                  placeholder="Category name"
                  onChange={(e) => changeHandler(e)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group as={Col} md="7" className="position-relative mb-4">
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                required
                name="category_img"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  changeHandlerFile(e);
                }}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
          <img
            className="new-container-bottom__right--img"
            src={
              file
                ? URL.createObjectURL(file)
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8-e9Jpr1AyNwkdf_iE_zQjknFwrn3kBbQQ&usqp=CAU"
            }
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default CreateCategory;
