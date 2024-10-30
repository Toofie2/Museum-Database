import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import TicketPage from "./pages/TicketPage.jsx";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ExhibitionViewPage from "./pages/ExhibitionViewPage";
import GiftShopPage from "./pages/GiftShopPage";
import GiftShopCategoryPage from "./pages/GiftShopCategoryPage";
import TicketPurchasedPage from "./pages/TicketPurchasedPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tickets" element={<TicketPage />} />
        <Route path="/tickets/purchased" element={<TicketPurchasedPage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/exhibition/:id" element={<ExhibitionViewPage />} />
        <Route path="/shop" element={<GiftShopPage />} />
        <Route path="/giftshop/:id" element={<GiftShopCategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
