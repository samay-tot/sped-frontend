import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Service from "../pages/Service";
import SignUp from "../pages/Signup";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";
import ResetPassword from "../pages/ResetPassword";
import Subscription from "../pages/Subscription";
import PaymentSuccess from "../pages/PaymentSuccess";
import CouponCode from "../pages/CouponCode";
import PaymentFailed from "../pages/PaymentFailed";
import Directory from "../pages/Directory";
import DirectoryDetails from "../pages/DirectoryDetails";

export const AppRouter: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signUp" element={<AuthRoute><SignUp /></AuthRoute>} />
        <Route path="/reset-password" element={<AuthRoute><ResetPassword /></AuthRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/service" element={<ProtectedRoute><Service /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/payment-failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />
        <Route path="/coupon-code" element={<ProtectedRoute><CouponCode /></ProtectedRoute>} />
        <Route path="/directory" element={<AuthRoute><Directory /></AuthRoute>} />
        <Route path="/directory-details" element={<AuthRoute><DirectoryDetails /></AuthRoute>} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Layout>
  );
};
