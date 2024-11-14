import { Routes, Route, Navigate } from "react-router-dom";
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
import EmployeeLayout from "./pages/employee/EmployeeLayout.jsx";
import Dashboard from "./pages/employee/Dashboard.jsx";
import Settings from "./pages/employee/Settings.jsx";
import CategoryLog from "./components/CategoryLog.jsx";
import Reports from "./pages/employee/reports/Reports"; // Corrected import based on your filename
import ResetpasswordPage from "./pages/ResetpasswordPage.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Unprotected Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/resetpassword" element={<ResetpasswordPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collection/:id" element={<CollectionsViewPage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/exhibition/:id" element={<ExhibitionViewPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/shop" element={<GiftShopPage />} />
        <Route path="/giftshop/:id" element={<GiftShopCategoryPage />} />

        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<Navigate to="exhibition" replace />} />
            <Route path=":category" element={<CategoryLog />} />
          </Route>
          <Route path="reports" element={<Reports />} /> {/* Correctly pointing to Reports */}
        </Route>

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
