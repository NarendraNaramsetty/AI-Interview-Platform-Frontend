// src/common/ToastProvider.jsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    newestOnTop
    closeOnClick
    pauseOnHover
  />
);

export default ToastProvider;