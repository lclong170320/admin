import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import * as staffApi from "../../../api/staff";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";

function Password({ setShowModalPassword, authorId }) {
  const staff_id = authorId;
  const [show, setShow] = useState(true);
  const handleClose = () => {
    setShow(false);
    setShowModalPassword(false);
  };

  const [staff, setStaff] = useState([]);
  const [passwordNew, setPasswordNew] = useState();

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await staffApi.get(`staffs?staff_id=${staff_id}`);
      setStaff(data.staff);
    };
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const data = {
    passwordNew,
  };

  const findFormErrors = () => {
    const { passwordOld, passwordNew, againPassword } = form;
    const newErrors = {};
    // errors
    if (staff) {
      const checkPassword = bcrypt.compareSync(
        passwordOld,
        staff[0].account.password
      );
      if (checkPassword === false) {
        newErrors.passwordOld = "Mật khẩu cũ không đúng";
      }
    }
    if (passwordNew.length < 8)
      newErrors.passwordNew = "Mật khẩu phải đủ 8 ký tự";
    if (passwordNew !== againPassword)
      newErrors.againPassword = "Mật khẩu nhập lại bị sai";
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      data.passwordNew = passwordNew;
      event.preventDefault();
      axios
        .put(
          `http://localhost:3000/staffs/changePassword/${staff_id}`,
          {
            password: data.passwordNew,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res) {
            toast.success(`Bạn đổi mật khẩu thành công`, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          }
          setShowModalPassword(false);
        })
        .catch((err) => {
          if (err) {
            toast.error(`Bạn đổi mật khẩu không thành công`, {
              position: "top-right",
              autoClose: 1000,
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
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Đổi mật khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={12} className="mb-3 mt-1">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Mật khẩu củ *</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="passwordOld "
                  placeholder="Mật khẩu củ"
                  onChange={(e) => {
                    setField("passwordOld", e.target.value);
                  }}
                  isInvalid={!!errors.passwordOld}
                />
                {errors.passwordOld ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.passwordOld}
                  </Form.Control.Feedback>
                ) : (
                  ""
                )}
              </Form.Group>
            </Col>
            <Col sm={12} className="mb-3">
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Mật khẩu *</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="passwordNew"
                  placeholder="Mật khẩu"
                  onChange={(e) => {
                    setField("passwordNew", e.target.value);
                    setPasswordNew(e.target.value);
                  }}
                  isInvalid={!!errors.passwordNew}
                />
                {errors.passwordNew ? (
                  <Form.Text className="text-muted">
                    Mật phải đủ 8 ký tự
                  </Form.Text>
                ) : (
                  <Form.Control.Feedback type="invalid">
                    {errors.passwordNew}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col sm={12} className="mb-3">
              <Form.Group controlId="validationCustom03">
                <Form.Label>Nhập lại mật khẩu *</Form.Label>
                <Form.Control
                  required
                  name="againPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu "
                  onChange={(e) => {
                    setField("againPassword", e.target.value);
                  }}
                  isInvalid={!!errors.againPassword}
                />
                <Form.Control.Feedback
                  style={{ marginLeft: "60px" }}
                  type="invalid"
                >
                  {errors.againPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={12} className="mb-4">
              <Button type="submit" variant="warning">
                Đổi mật khẩu
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Password;
