import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { FaUsersCog, FaFileInvoiceDollar } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";
import { TbDiscount2 } from "react-icons/tb";
import { CgProductHunt } from "react-icons/cg";
import { BiCategory } from "react-icons/bi";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";

function Sidebar() {
  let navigate = useNavigate();
  const logOut = () => {
    const exit = window.confirm(`Do you want to exit?`);
    if (exit) {
      localStorage.removeItem("author");
      navigate("/login");
    }
  };
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" className="sidebar__link">
          <span className="logo"> Mini supermarket </span>
        </Link>
      </div>
      <div className="center" style={{ fontSize: "26px" }}>
        <ul>
          <p className="title">MAIN</p>
          <Link to="/" className="sidebar__link">
            <li>
              <MdDashboard className="icon" />
              <span>DashBoard</span>
            </li>
          </Link>
          <p className="title">LIST</p>
          <Link to="/orders" className="sidebar__link">
            <li className="mt-2">
              <FaFileInvoiceDollar className="icon1" />
              <span>Order</span>
            </li>
          </Link>
          <Link to="/categories" className="sidebar__link">
            <li className="mt-2">
              <BiCategory className="icon1" />
              <span>Category</span>
            </li>
          </Link>
          <Link to="/products" className="sidebar__link">
            <li className="mt-2">
              <CgProductHunt className="icon1" />
              <span>Product</span>
            </li>
          </Link>
          <Link to="/discounts" className="sidebar__link">
            <li className="mt-2">
              <TbDiscount2 className="icon1" />
              <span>Discount</span>
            </li>
          </Link>
          <Link to="/staffs" className="sidebar__link">
            <li className="mt-2">
              <FaUsersCog className="icon1" />
              <span>Staff</span>
            </li>
          </Link>
          <Link to="/customers" className="sidebar__link">
            <li className="mt-2">
              <FiUsers className="icon1" />
              <span>Customer</span>
            </li>
          </Link>
          <Link to="/" onClick={logOut} className="sidebar__link">
            <li className="mt-2">
              <MdExitToApp className="icon1" />
              <span>Exit</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
}

export default Sidebar;
