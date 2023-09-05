import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Categories from "./pages/categories/Categories";
import UpdateCategory from "./pages/categories/UpdateCategory";
import CreateCategory from "./pages/categories/CreateCategory";

import Home from "./pages/home/Home";
import Order from "./pages/orders/Orders";
import DetailOrder from "./pages/orders/DetailOrder";

import NewOrder from "./pages/newOrder/NewOrder";

//login
import Login from "./pages/login/Login";

//products
import Products from "./pages/products/Products";
import CreateProduct from "./pages/products/CreateProduct";
import UpdateProduct from "./pages/products/UpdateProduct";
import DetailProduct from "./pages/products/DetailProduct";
import Comment from "./pages/products/Comment";

//discounts
import Discounts from "./pages/discounts/Discount";
import CreateDiscount from "./pages/discounts/CreateDiscount";
import UpdateDiscount from "./pages/discounts/UpdateDiscount";
// import DetailProduct from './pages/products/DetailProduct';

//customer
import Customer from "./pages/customer/Customer";
import DetailCustomer from "./pages/customer/DetailCustomer";

//staff
import Staff from "./pages/staffs/Staff";
import UpdateStaff from "./pages/staffs/UpdateStaff";
import CreateStaff from "./pages/staffs/CreateStaff";

import PrivateRoutes from "./utils/PrivateRoutes";
import { DarkModeContextProvider } from "./context/darkModeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DarkModeContextProvider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />

              <Route path="/orders" element={<Order />} />
              <Route
                path="/orders/detail-order/:order_id"
                element={<DetailOrder />}
              />

              <Route path="/categories" element={<Categories />} />
              <Route
                path="/categories/create-category"
                element={<CreateCategory />}
              />
              <Route
                path="/categories/update-category/:category_id"
                element={<UpdateCategory />}
              />

              <Route path="/products" element={<Products />} />
              <Route
                path="/products/create-product"
                element={<CreateProduct />}
              />
              <Route
                path="/products/detailProduct/:product_id"
                element={<DetailProduct />}
              />
              <Route
                path="/products/update-product/:product_id"
                element={<UpdateProduct />}
              />
              <Route
                path="/products/:product_id/comment"
                element={<Comment />}
              />

              <Route path="/staffs" element={<Staff />} />
              <Route
                path="/staffs/update-staff/:staff_id"
                element={<UpdateStaff />}
              />
              <Route path="/staffs/createStaff/" element={<CreateStaff />} />

              <Route path="/customers" element={<Customer />} />
              <Route
                path="/customers/customerDetail/:customer_id"
                element={<DetailCustomer />}
              />

              <Route path="/discounts" element={<Discounts />} />
              <Route
                path="/discounts/createDiscount/:product_id"
                element={<CreateDiscount />}
              />
              <Route
                path="/discounts/updateDiscount/:discount_id"
                element={<UpdateDiscount />}
              />
            </Route>
          </Route>

          <Route path="/login">
            <Route index element={<Login />}></Route>
          </Route>
          {/* admin order or staff order */}
          <Route element={<PrivateRoutes />}>
            <Route path="/new-oder">
              <Route index element={<NewOrder />}></Route>
            </Route>
          </Route>
        </Routes>
      </DarkModeContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
