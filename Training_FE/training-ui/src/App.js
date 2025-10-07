import React from "react";
import Login from "./Pages/Login";
import { Route, Router, Routes } from "react-router-dom";
import Register from "./Pages/Register";
import Product from "./Pages/Product";
import AddProduct from "./Pages/AddProduct";
import UpdateProduct from "./Pages/UpdateProduct";
import DeleteProduct from "./Pages/DeleteProduct";
import 'bootstrap/dist/css/bootstrap.min.css';
import GetAllProducts from "./Pages/GetAllProducts";
import GetProductById from "./Pages/GetProductById";
import Home from "./Pages/Home";
import SearchResults from "./Pages/SearchResults";
import UserHome from "./Pages/UsersOperation/UserHome";
import AdminHome from "./Pages/AdminHome";
import ProductDetails from "./Pages/ProductDetails";
import UserProfile from "./Pages/UsersOperation/UserProfile";
import WishlistPage from "./Pages/UsersOperation/WishlistPage";
import CartPage from "./Pages/UsersOperation/CartPage";
import UserOrdersPage from "./Pages/UsersOperation/UserOrdersPage";
import AdminProfile from "./Pages/AdminProfile";
import AdminOrdersPage from "./Pages/AdminOrdersPage";
import AdminCustomersPage from "./Pages/AdminCustomersPage";
import AdminCustomerOrdersPage from "./Pages/AdminCustomerOrdersPage";


function App() {
  return(
    
    <Routes>
      <Route path="login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/search/:query" element={<SearchResults />} />
       <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/user-home" element={<UserHome/>} />
      <Route path="/user-profile" element={<UserProfile/>} />
      <Route path="/wishlist" element={<WishlistPage/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/orders" element={<UserOrdersPage/>} />
      {/* admin-profile */}
      <Route path="/admin-home" element={<AdminHome/>} />
      <Route path="/admin-profile" element={<AdminProfile/>} />

      {/* admin-customers */}

      <Route path="/admin-customers" element={<AdminCustomersPage />} />

      <Route path="/admin-customer-orders/:userId" element={<AdminCustomerOrdersPage />} />



      {/* admin-orders */}

      <Route path="/admin-orders" element={<AdminOrdersPage/>} />

      <Route path="/all-products" element={<GetAllProducts />} />
      <Route path="get-product-by-id" element={<GetProductById />} />
    
        <Route path="/products" element={<Product/>} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/update-product" element={<UpdateProduct />} /> 
        <Route path="/delete-product" element={<DeleteProduct />} />
        <Route path="/" element={<Home />} />  {/*Default page to render */}

    </Routes>
  
  )
}

export default App;

