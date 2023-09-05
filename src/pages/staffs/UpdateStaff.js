import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import moment from "moment";

import Row from "react-bootstrap/Row";

import { useParams } from "react-router-dom";
import * as staffAPI from "../../api/staff";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// import { Link } from "react-router-dom";

function UpdateStaff() {
  const { staff_id } = useParams();
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
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await staffAPI.get(`staffs?staff_id=${staff_id}`);
      setUsername(data.staffs[0].account?.username);
      setPassword(data.staffs[0].account?.password);
      setName(data.staffs[0].staff_name);
      setDob(data.staffs[0].staff_dob);
      setType(data.staffs[0].staff_type);
      setAddress(data.staffs[0].staff_address);
      setGmail(data.staffs[0].staff_gmail);
      setPhone(data.staffs[0].staff_phone);
      setAvatar(data.staffs[0].staff_avatar);
    };
    fetchAPI();
  }, [staff_id]);

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
        .put(
          `http://localhost:3000/staffs/${staff_id}`,
          {
            username: username,
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
          if (res) {
            toast.success("Update password success", {
              position: "top-right",
              autoClose: 2000,
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
            toast.error("Update password failed", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          }
        });
    }
  };

  return (
    <div className="new-container">
      <div className="new-container-top">
        <span className="new-container-top__title">Update staff</span>
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
                  defaultValue={username}
                  placeholder="User name"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="5" controlId="validationCustom03">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  defaultValue={password}
                  disabled
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
                  defaultValue={name}
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
                  defaultValue={phone}
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
                  defaultValue={moment(dob).format("YYYY-MM-DD")}
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
                  <option value={type}>
                    {type === false ? "Staff" : "Admin"}
                  </option>
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
                  defaultValue={gmail}
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
                  defaultValue={address}
                  name="Address"
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
                name="file"
                accept="image/*"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </Form.Group>
            <Button type="submit">Save</Button>
            <ToastContainer />
          </Form>
        </div>
        <div className="new-container-bottom__right">
          <img
            className="new-container-bottom__right--img"
            src={
              file
                ? URL.createObjectURL(file)
                : avatar === undefined
                ? ""
                : `http://127.0.0.1:8081//${avatar}`
            }
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default UpdateStaff;
