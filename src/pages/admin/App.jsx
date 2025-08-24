import React from "react";
import Header from "./component/Header";
import Footer from "./component/Footer";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Table from "./partial/List";
import Add from "./partial/Add";
import Edit from "./partial/Edit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="admin-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}   // ৩ সেকেন্ড পর auto close হবে
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          toastStyle={{ marginTop: "20px" }}
        />
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
