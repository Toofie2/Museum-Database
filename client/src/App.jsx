import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ExhibitionsPage from './pages/ExhibitionsPage';
import ExhibitionViewPage from './pages/ExhibitionViewPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/exhibitions" element={<ExhibitionsPage />} />
      <Route path="/exhibition/:id" element={<ExhibitionViewPage />} />
    </Routes>
  );
};

export default App;