import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Row from "react-bootstrap/Row";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { Link } from "react-router-dom";

function CreateStaff() {
  let navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [file, setFile] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState();
  const [name, setName] = useState();
  const [gmail, setGmail] = useState();
  const [dob, setDob] = useState();
  const [type, setType] = useState();
  const [address, setAddress] = useState();

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
          `http://localhost:3000/staffs/`,
          {
            username: username,
            password: password,
            staff_name: name,
            staff_phone: phone,
            staff_gmail: gmail,
            staff_dob: dob,
            staff_type: type,
            staff_address: address,
            staff_avatar: file,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          toast("Create staff successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            navigate("/staffs/");
          }, 3000);
        })
        .catch((err) => {
          toast.error("Create staff failed", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        });
    }
  };

  return (
    <div className="new-container">
      <div className="new-container-top">
        <span className="new-container-top__title">Add staff</span>
      </div>
      <div className="new-container-bottom">
        <div className="new-container-bottom__left">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom01">
                <Form.Label>User name (login)</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="username"
                  placeholder="User name"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Name staff</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="name"
                  placeholder="Last name"
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom04">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Dob</Form.Label>
                <Form.Control
                  required
                  type="date"
                  name="Dob"
                  placeholder="Dob"
                  onChange={(e) => setDob(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  onChange={(e) => setType(e.target.value)}
                  aria-label="Default select example"
                >
                  <option value="0">Staff</option>
                  <option value="1">Admin</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Gmail</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="gmail"
                  placeholder="Gmail"
                  onChange={(e) => setGmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="gmail"
                  placeholder="Address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Form.Group as={Col} md="7" className="position-relative mb-4">
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                id="file"
                required
                name="file"
                accept="image/*"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </Form.Group>
            <Button type="submit">Lưu</Button>
            <ToastContainer />
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

export default CreateStaff;
