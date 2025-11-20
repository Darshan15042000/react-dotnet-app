import React from "react";
import Login from "./Pages/Login";
import { Route, Router, Routes } from "react-router-dom";
import Register from "./Pages/Register";
import Product from "./Pages/Product";
import AddProduct from "./Pages/AdminOperation/AddProduct";
import UpdateProduct from "./Pages/AdminOperation/UpdateProduct";
import DeleteProduct from "./Pages/AdminOperation/DeleteProduct";
import 'bootstrap/dist/css/bootstrap.min.css';
import GetAllProducts from "./Pages/GetAllProducts";
import GetProductById from "./Pages/GetProductById";
import Home from "./Pages/Home";
import SearchResults from "./Pages/SearchResults";
import UserHome from "./Pages/UsersOperation/UserHome";

import ProductDetails from "./Pages/ProductDetails";
import UserProfile from "./Pages/UsersOperation/UserProfile";
import WishlistPage from "./Pages/UsersOperation/WishlistPage";
import CartPage from "./Pages/UsersOperation/CartPage";
import UserOrdersPage from "./Pages/UsersOperation/UserOrdersPage";


import AdminProfile from "./Pages/AdminOperation/AdminProfile";
import AdminOrdersPage from "./Pages/AdminOperation/AdminOrdersPage";
import AdminCustomersPage from "./Pages/AdminOperation/AdminCustomersPage";
import AdminCustomerOrdersPage from "./Pages/AdminOperation/AdminCustomerOrdersPage";
import AdminDashboard from "./Pages/AdminOperation/AdminDashboard";

import ManageProductsPage from "./Pages/AdminOperation/ManageProductsPage";
import PaymentPage from "./Pages/UsersOperation/PaymentPage";
import UserAddressesPage from "./Pages/UserAddress/UserAddressesPage";
import AddAddressPage from "./Pages/UserAddress/AddAddressPage";
import EditAddressPage from "./Pages/UserAddress/EditAddressPage";


import DeliveryPartnerLogin from "./Pages/DeliveryPartner/DeliveryPartnerLogin";
import DeliveryPartnerRegister from "./Pages/DeliveryPartner/DeliveryPartnerRegister";
import DeliveryPartnerDashboard from "./Pages/DeliveryPartner/DeliveryPartnerDashboard";
import DeliveryPartnerProfile from "./Pages/DeliveryPartner/DeliveryPartnerProfile";


// import AdminHome from "./Pages/AdminOperation/AdminHome";




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
      <Route path="/payment" element={<PaymentPage/>} />
      <Route path="/addresses" element={<UserAddressesPage/>} />
      <Route path="/add-address" element={<AddAddressPage/>} />
     <Route path="/edit-address/:id" element={<EditAddressPage />} />



      {/* admin-profile */}
      <Route path="/admin-dashboard" element={<AdminDashboard/>} />

      <Route path="/admin-manage-product" element={<ManageProductsPage/>} />


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

        {/* delivery Partner */}

        <Route path="/deliverypartner-login" element={<DeliveryPartnerLogin/>} />
        <Route path="/deliverypartner-register" element={<DeliveryPartnerRegister />} />
        <Route path="/deliverypartner-dashboard" element={<DeliveryPartnerDashboard />} />

        <Route path="/deliverypartner-profile" element={<DeliveryPartnerProfile />} />




    </Routes>
  
  )
}

export default App;

