import "bootstrap/dist/css/bootstrap.min.css";
import "./style/dark.css";
import React, { useContext } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import NavbarAdmin from "./components/navbar/Navbar";
import { DarkModeContext } from "./context/darkModeContext";

function App() {
  const {darkMode} = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Sidebar />
      <div className="app-container">
        <NavbarAdmin />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
