import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import LoadPage from "../../components/loadpage/Loadpage";
import * as productApi from "../../api/product";
import { Form, InputGroup } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { FiClock } from "react-icons/fi";
import "./NewOrder.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as categoryApi from "../../api/category";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";

import Info from "../../components/InfoStaff/info/Info";
import Password from "../../components/InfoStaff/changePassword/Password";

function NewOrder() {
  let navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState();
  const [searchCategory, setSearchCategory] = useState();
  const [cartItem, setCartItem] = useState([]);
  const [checkCartButton, setCheckCartButton] = useState(false);
  const [total, setTotal] = useState(0);
  const [author, setAuthor] = useState();

  useEffect(() => {
    let local = JSON.parse(localStorage.getItem("author"));
    if (local) {
      setAuthor(local);
    }
    setCheckCartButton(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkCartButton]);

  useEffect(() => {
    const fetchAPI = async () => {
      let data;
      if (searchName !== undefined) {
        data = await productApi.get(`product?product_name=${searchName}`);
      } else if (searchCategory !== undefined) {
        data = await productApi.get(`product?category_id=${searchCategory}`);
      } else {
        data = await productApi.get("product?limit=2000");
      }
      setProducts(data.products);
      setLoading(false);
    };
    fetchAPI();
  }, [searchName, searchCategory]);

  useEffect(() => {
    const fetchAPI = async () => {
      let data;
      data = await categoryApi.get("categories?limit=1000");
      setCategories(data.categories);
      setLoading(false);
    };
    fetchAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settings = {
    className: "center",
    infinite: true,
    slidesToShow: 7,
    swipeToSlide: true,
  };

  useEffect(() => {
    if (cartItem) {
      let local = localStorage.getItem("cart");
      if (local) {
        setCartItem(JSON.parse(local));
      }
    }
    setCheckCartButton(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkCartButton]);

  const onAddCart = (product_id) => {
    let carts = [];
    const product = products.find((x) => x.product_id === product_id);

    const getCart = localStorage.getItem("cart");

    if (getCart) {
      carts = JSON.parse(getCart);
    }
    let exits = carts.find((x) => {
      return x.product_id === product_id;
    });
    if (exits) {
      exits.qty = exits.qty + 1;
    } else {
      carts.push({
        product_id: product.product_id,
        category_id: product.category_id,
        product_describe: product.product_describe,
        product_name: product.product_name,
        discount_percent: product.discount?.discount_percent
          ? product.discount?.discount_percent
          : 0,
        image: product.images[0]?.image_name,
        product_price: Number(product.product_price),
        provider: product.provider,
        qty: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(carts));
    toast.success(`Add cart successfully`, {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
    setCheckCartButton(true);
  };
  const addQuantity = (product_id) => {
    const exits = cartItem.find((x) => x.product_id === product_id);
    if (exits) {
      let listCart = cartItem.map((item) => {
        return item.product_id === product_id
          ? { ...item, qty: exits.qty + 1 }
          : item;
      });
      localStorage.setItem("cart", JSON.stringify(listCart));
    }
    setCheckCartButton(true);
  };
  const subtractQuantity = (product_id) => {
    const exits = cartItem.find((x) => x.product_id === product_id);
    if (exits.qty !== 1) {
      let listCart = cartItem.map((item) => {
        return item.product_id === product_id
          ? { ...item, qty: exits.qty - 1 }
          : item;
      });
      localStorage.setItem("cart", JSON.stringify(listCart));
    }
    setCheckCartButton(true);
  };
  const onClickDelete = (product_id) => {
    const listItemOther = cartItem.filter((item) => {
      return item.product_id !== product_id;
    });
    setCartItem(listItemOther);
    localStorage.setItem("cart", JSON.stringify(listItemOther));
    toast.success(`Successfully removed product from cart`, {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
    setCheckCartButton(true);
  };

  useEffect(() => {
    let sumCart = 0;
    cartItem.map(
      (item) =>
        (sumCart +=
          (item.product_price -
            (item.discount_percent * item.product_price) / 100) *
          item.qty)
    );
    if (sumCart !== 0) {
      setTotal(sumCart);
    } else {
      setTotal(sumCart);
    }
  }, [total, cartItem]);

  let detailCart = [];
  const addCartApi = () => {
    const agreeDelete = window.confirm(`Do you want to create an order?`);
    let local = JSON.parse(localStorage.getItem("author"));
    if (agreeDelete && local) {
      // eslint-disable-next-line array-callback-return
      cartItem.map((item) => {
        detailCart = [
          ...detailCart,
          {
            product_id: item.product_id,
            detail_quantity: item.qty,
            detail_price:
              item.discount_percent > 0
                ? item.product_price * item.discount_percent
                : item.product_price,
          },
        ];
      });
      axios
        .post(`http://localhost:3000/orders?isAdmin=true`, {
          staff_id: local.id,
          order_total: total,
          address: "Order tại cửa hàng",
          order_payment: "Trực Tiếp",
          order_detail: detailCart,
          order_note: "Không có ghi chú",
        })
        .then((res) => {
          if (res) {
            toast.success("Order creation successfully", {
              position: "top-right",
              autoClose: 500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
          }
          localStorage.removeItem("cart");
          setCartItem([]);
          setTotal(0);
        })
        .catch((err) => {
          if (err) {
            toast.error("Order creation failed", {
              position: "top-right",
              autoClose: 500,
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

  const today = new Date();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setTimer(time);
    setInterval(() => {
      setTimer(time);
    }, 60000);
  }, [timer, time]);
  const [showModal, setShowModal] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleShowPassword = () => setShowModalPassword(true);

  const exit = () => {
    const agreeDelete = window.confirm(
      `you want to exit, your total work time is ${timer}s`
    );
    if (agreeDelete) {
      localStorage.removeItem("author");

      navigate("/login");
    }
  };
  if (loading) return <LoadPage />;
  else
    return (
      <Container fluid>
        <Row>
          <Col
            sm={8}
            style={{
              border: "1px solid black",
              borderTop: "none",
              height: "657px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <NavDropdown
                style={{
                  marginTop: "5px",
                }}
                title={`Hello ${author.username}`}
                id="nav-dropdown"
              >
                <NavDropdown.Item onClick={handleShow}>
                  Information
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleShowPassword}>
                  Change password
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="4.4" onClick={exit}>
                  Exit
                </NavDropdown.Item>
              </NavDropdown>

              <div>
                <p>
                  {" "}
                  <FiClock size={22} /> :{timer}s
                </p>{" "}
              </div>

              <InputGroup
                onChange={(e) => setSearchName(e.target.value)}
                size="sm"
                className="mt-1"
                style={{ width: "30%", height: "5%" }}
              >
                <Form.Control
                  placeholder="Search product by name"
                  aria-describedby="basic-addon2"
                />
                <Button variant="outline-secondary" id="button-addon2">
                  <AiOutlineSearch size={25} />
                </Button>
              </InputGroup>
            </div>
            <div
              style={{
                textAlign: "center",
                width: "95%",
                height: "50px",
                marginLeft: "20px",
              }}
            >
              <Slider {...settings}>
                {categories.map((category, index) => {
                  return (
                    <>
                      <div
                        className="overflow-hidden"
                        style={{ width: "100px" }}
                        key={index}
                      >
                        <Button
                          onClick={() =>
                            setSearchCategory(category.category_id)
                          }
                          style={{ height: "34px" }}
                          variant="outline-dark"
                        >
                          {category.category_name}
                        </Button>
                      </div>
                    </>
                  );
                })}
              </Slider>
            </div>

            <div
              style={{ height: "540px", width: "898px" }}
              className="overflow-auto"
            >
              <Row className="mt-1 mb-2">
                {products.map((product, index) => {
                  return (
                    <>
                      <Col key={index} sm={2} className="mt-2 mb-1">
                        <Card
                          onClick={() => {
                            onAddCart(product.product_id);
                          }}
                          className="itemOrder"
                          style={{
                            width: "130px",
                            height: "170px",
                          }}
                        >
                          <Card.Img
                            variant="top"
                            style={{
                              width: "100px",
                              height: "55px",
                              margin: "0 auto",
                            }}
                            src={`http://127.0.0.1:8081//${product.images[0]?.image_name}`}
                          />
                          <Card.Body>
                            <Card.Text
                              style={{
                                width: "110%",
                                height: "80px",
                              }}
                            >
                              <div
                                style={{
                                  height: "50px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis !important",
                                }}
                              >
                                {product.product_name}
                              </div>
                              <div style={{ color: "#008400" }}>
                                {product.product_price.toLocaleString("vi", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </div>
                              {product.discount?.discount_percent ? (
                                <div style={{ color: "red" }}>
                                  Giảm: {product.discount?.discount_percent}%
                                </div>
                              ) : (
                                <></>
                              )}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </>
                  );
                })}
              </Row>
            </div>
          </Col>
          <Col
            sm={4}
            style={{
              border: "1px solid black",
              borderTop: "none",
              borderRight: "none",
            }}
          >
            <h6> List of products to buy </h6>

            {cartItem.map((product, index) => (
              <Row
                key={index}
                className="mt-3 mb-3"
                style={{ borderBottom: "1px solid #999" }}
              >
                <Col sm={8}>
                  {product.product_name}
                  <div className={"home-cart-content-quantity"}>
                    <div className={"home-cart-content-quantitynum"}>
                      <button
                        onClick={() => {
                          subtractQuantity(product.product_id);
                        }}
                        className={"noselect"}
                      >
                        -
                      </button>
                      <Form.Group
                        className={"formNumberCart"}
                        controlId="formBasicEmail"
                      >
                        <Form.Control
                          type="text"
                          value={product.qty}
                          readOnly
                        />
                      </Form.Group>
                      <button
                        onClick={() => {
                          addQuantity(product.product_id);
                        }}
                        className={"noselect-1"}
                      >
                        +
                      </button>

                      <button
                        onClick={() => {
                          onClickDelete(product.product_id);
                          checkCartButton();
                        }}
                        className={"deleteCart"}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </Col>
                <Col sm={4}>
                  {product.discount_percent > 0 ? (
                    <>
                      <strong style={{ color: "red" }}>
                        {(
                          (product.product_price -
                            (product.discount_percent * product.product_price) /
                              100) *
                          product.qty
                        ).toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </strong>
                      <br />
                      <span className={"priceDiscount"}>
                        {" "}
                        {(product.product_price * product.qty).toLocaleString(
                          "vi",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <strong>
                        {(product.product_price * product.qty).toLocaleString(
                          "vi",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        )}
                      </strong>
                      <br />
                    </>
                  )}
                </Col>
              </Row>
            ))}

            <div className={"sumCart"}>
              <span> Total order: </span>
              <label className={"sumCart1"}>
                {" "}
                {total.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
              </label>
            </div>
            <div className={"payment"}>
              <Button
                variant="primary"
                className={"payment1"}
                onClick={() => {
                  addCartApi();
                }}
              >
                Payment
              </Button>
            </div>
          </Col>
          <ToastContainer />
        </Row>
        {showModal ? (
          <Info setShowModal={setShowModal} authorId={author.id} />
        ) : (
          <></>
        )}
        {showModalPassword ? (
          <Password
            setShowModalPassword={setShowModalPassword}
            authorId={author.id}
          />
        ) : (
          <></>
        )}
      </Container>
    );
}

export default NewOrder;
