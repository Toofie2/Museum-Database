import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import CustomerPage from "./pages/CustomerPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
//import LoginPage from "./pages/LoginPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/customer" element={<CustomerPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
};

export default App;