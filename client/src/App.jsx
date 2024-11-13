import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ExhibitionViewPage from "./pages/ExhibitionViewPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionsViewPage from "./pages/CollectionsViewPage";
import TicketPage from "./pages/TicketPage.jsx";
import GiftShopPage from "./pages/GiftShopPage";
import GiftShopCategoryPage from "./pages/GiftShopCategoryPage";
import GiftShopProductPage from "./pages/GiftShopProductPage";
import TicketPurchasedPage from "./pages/TicketPurchasedPage.jsx";
import CustomerPage from "./pages/CustomerPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import PostreviewPage from "./pages/PostreviewPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MembershipregPage from "./pages/MembershipregPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tickets" element={<TicketPage />} />
      <Route path="/tickets/purchased" element={<TicketPurchasedPage />} />
      <Route path="/exhibitions" element={<ExhibitionsPage />} />
      <Route path="/exhibition/:id" element={<ExhibitionViewPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/collection/:id" element={<CollectionsViewPage />} />
      <Route path="/shop" element={<GiftShopPage />} />
      <Route path="/shop/:prodCatID" element={<GiftShopCategoryPage />} />
      <Route path="/shop/:prodCatID/:prodID" element={<GiftShopProductPage />} />
      <Route path="/customer" element={<CustomerPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/postreview" element={<PostreviewPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/membership" element={<MembershipregPage />} />
    </Routes>
  );
};

export default App;
