import "./navbar.css";
import { MdDarkMode } from "react-icons/md";
import { BiBell } from "react-icons/bi";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { FaSun } from "react-icons/fa";
import { Badge, Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import * as staffApi from "../../api/staff";
import Info from "../InfoStaff/info/Info";
import Password from "../InfoStaff/changePassword/Password";
import { useNavigate } from "react-router-dom";

function NavbarAdmin() {
  const { dispatch } = useContext(DarkModeContext);
  const [author, setAuthor] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    setAuthor(JSON.parse(localStorage.getItem("author")));
  }, []);

  useEffect(() => {
    if (author.id) {
      const fetchAPI = async () => {
        const data = await staffApi.get(`staffs?staff_id=${author.id}`);
        setStaff(data.staffs);
      };
      fetchAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author.id]);

  const [showModal, setShowModal] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleShowPasword = () => setShowModalPassword(true);

  let navigate = useNavigate();
  const logOut = () => {
    const exit = window.confirm(`Do you want to exit?`);
    if (exit) {
      localStorage.removeItem("author");
      navigate("/login");
    }
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="content">
          <h5>
            Hello mini supermarket website system, this is the admin page of the
            system
          </h5>
        </div>
        <div className="items">
          <div
            className="item cssBlack"
            onClick={() => dispatch({ type: "DARK" })}
          >
            <MdDarkMode className="icon" />
          </div>
          <div
            className="item cssBlack"
            onClick={() => dispatch({ type: "LIGHT" })}
          >
            <FaSun className="icon" />
          </div>

          <div className="item ">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-disabled">Notice orders</Tooltip>}
            >
              <Link to={`/orders`} className="link">
                <Button variant="outline">
                  <BiBell className="icon buttonBacck" size={24} />{" "}
                  <Badge bg="secondary">9</Badge>
                </Button>
              </Link>
            </OverlayTrigger>
          </div>
          <div className="item">
            <Nav>
              <NavDropdown
                style={{ fontSize: "16px", marginTop: "4px" }}
                id="nav-dropdown-dark-example"
                title={author.username}
              >
                <NavDropdown.Item onClick={handleShow}>
                  Information
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleShowPasword}>
                  Change password
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link
                    to="/new-oder"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Create orders
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logOut}>Exit</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
          <div className="item">
            <Image
              src={`http://127.0.0.1:8081//${staff[0]?.staff_avatar}`}
              className="avatar"
            />
          </div>
        </div>
      </div>
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
    </div>
  );
}

export default NavbarAdmin;
