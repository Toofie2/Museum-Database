import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/authentication";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage.jsx";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ExhibitionViewPage from "./pages/ExhibitionViewPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionsViewPage from "./pages/CollectionsViewPage";
import TicketPage from "./pages/TicketPage.jsx";
import GiftShopPage from "./pages/GiftShopPage";
import GiftShopCategoryPage from "./pages/GiftShopCategoryPage";
import TicketPurchasedPage from "./pages/TicketPurchasedPage.jsx";
import CustomerPage from "./pages/CustomerPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import PostreviewPage from "./pages/PostreviewPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MembershipregPage from "./pages/MembershipregPage.jsx";

const App = () => {
  return (
    <AuthProvider>
    <Routes>
    {/* Unprotected Routes */}
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/collections" element={<CollectionsPage />} />
    <Route path="/collection/:id" element={<CollectionsViewPage />} />
    <Route path="/exhibitions" element={<ExhibitionsPage />} />
    <Route path="/exhibition/:id" element={<ExhibitionViewPage />} />
    <Route path="/review" element={<ReviewPage />} />

    {/* Protected Routes */}
    <Route
      path="/tickets"
      element={
        <ProtectedRoute>
          <TicketPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/tickets/purchased"
      element={
        <ProtectedRoute>
          <TicketPurchasedPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/shop"
      element={
        <ProtectedRoute>
          <GiftShopPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/giftshop/:id"
      element={
        <ProtectedRoute>
          <GiftShopCategoryPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/customer"
      element={
        <ProtectedRoute>
          <CustomerPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/postreview"
      element={
        <ProtectedRoute>
          <PostreviewPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/membership"
      element={
        <ProtectedRoute>
          <MembershipregPage />
        </ProtectedRoute>
      }
    />
  </Routes>
    </AuthProvider>
  );
};

export default App;
