import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CustomerSignup from "./pages/CustomerSignup";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CustomerSignup />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;