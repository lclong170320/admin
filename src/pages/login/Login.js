import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "./login.css";
import { useEffect } from "react";

import bcrypt from "bcryptjs";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

import { RiLockPasswordLine } from "react-icons/ri";

import { BiUser } from "react-icons/bi";
// api
import * as staffApi from "../../api/staff";

const Login = () => {
  let navigate = useNavigate();
  // call api
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await staffApi.get("staffs?limit=10000");
      setStaff(data.staffs);
    };
    fetchAPI();
  }, []);

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const authLogin = {
    id: "",
    username: "",
  };
  const findFormErrors = () => {
    const { username, password } = form;
    const newErrors = {};
    // name errors
    // Find user login info
    var checkUsername = [];
    for (let i = 0; i <= staff.length; i++) {
      checkUsername.push(staff[i]?.account.username);
      const check = staff[i]?.account;
      const checkId = staff[i]?.staff_id;
      if (check) {
        if (checkUsername.includes(username) === true) {
          if (check.username === username) {
            authLogin.id = checkId;
          }
          const checkPassword = bcrypt.compareSync(password, check.password);
          if (checkPassword === false) {
            newErrors.password = "Mật khẩu không đúng vui lòng nhập lại";
          }
        }
      }
    }
    if (checkUsername.includes(username) === false) {
      newErrors.username = "Tên đăng nhập không tồn tại";
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();
    console.log(Object.keys(newErrors));
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      authLogin.username = form.username;
      event.preventDefault();
      localStorage.setItem("author", JSON.stringify(authLogin));
      navigate("/");
    }
  };

  return (
    <Container className="login1">
      <Row className="mt-5">
        <Col sm={16}>
          <Form onSubmit={handleSubmit} style={{ fontSize: "20px" }}>
            <Form.Group className="mb-4 mt-3" controlId="formBasicEmail">
              <Form.Label>
                User &emsp;&emsp;&nbsp;
                <BiUser className="icon-login1" size={20} />{" "}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="user name"
                name="username"
                onChange={(e) => setField("username", e.target.value)}
                required
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-5 mt-3" controlId="formBasicPassword">
              <Form.Label>
                Password &nbsp;
                <RiLockPasswordLine className="icon-login1" size={20} />
              </Form.Label>
              <Form.Control
                type="password"
                onChange={(e) => setField("password", e.target.value)}
                name="password"
                placeholder="password"
                required
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="mb-3 modal-Login">
              <Button
                type="submit"
                style={{ width: "150px", marginLeft: "70px" }}
                variant="success"
              >
                Submit login
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default Login;
