import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Row from "react-bootstrap/Row";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as categoryAPI from "../../api/category";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { Link } from "react-router-dom";

function UpdateCategory() {
  const { category_id } = useParams();
  const [category, setCategory] = useState({});

  const [data, setData] = useState({
    category_name: "",
    category_img: "",
  });

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await categoryAPI.get(`category?category_id=${category_id}`);
      setCategory(data.categories[0]);
    };
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let navigate = useNavigate();
  const [file, setFile] = useState("");

  const [validated, setValidated] = useState(false);

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
    if (data.category_name === "") {
      data.category_name = category.category_name;
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      event.preventDefault();
      axios
        .put(
          `http://localhost:3000/categories/${category_id}`,
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
          toast.success("Update category success", {
            position: "top-right",
            autoClose: 1000,
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
          toast.error("Update category failed");
        });
    }
  };

  return (
    <div className="new-container">
      <div className="new-container-top">
        <span className="new-container-top__title">Upload Category</span>
      </div>
      <div className="new-container-bottom">
        <div className="new-container-bottom__left">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Form.Group as={Col} md="7" controlId="validationCustom01">
                <Form.Label>Category name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="category_name"
                  defaultValue={category.category_name}
                  placeholder="Category name"
                  onChange={(e) => changeHandler(e)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group
              style={{ width: "57%" }}
              as={Col}
              md="7"
              className="position-relative mb-4"
            >
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                name="category_img"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  changeHandlerFile(e);
                }}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Label>File name</Form.Label>
            <Form.Control
              style={{ width: "57%" }}
              className="position-relative mb-3"
              type="text"
              placeholder={category.category_img?.slice(8, 100)}
              disabled
              readOnly
            />
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
                : category.category_img === undefined
                ? ""
                : `http://127.0.0.1:8081//${category.category_img}`
            }
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default UpdateCategory;
