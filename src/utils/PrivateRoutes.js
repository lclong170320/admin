import { Outlet, Navigate } from "react-router-dom";
// api


const PrivateRoutes = () => {
  let auth = { token: false };

  const checkAuth = localStorage.getItem("author");
  if (checkAuth) {
    auth.token = true;
  }
  return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
