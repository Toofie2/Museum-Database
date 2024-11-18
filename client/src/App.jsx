import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./components/authentication";
import { useState } from "react";
import TicketFormDataContext from "./contexts/TicketFormDataContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import EmployeeProtectedRoute from "./components/EmployeeProtectedRoute";
import HomePage from "./pages/HomePage.jsx";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import ExhibitionViewPage from "./pages/ExhibitionViewPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionsViewPage from "./pages/CollectionsViewPage";
import TicketPage from "./pages/TicketPage.jsx";
import ExhibitionsPurchasePage from "./pages/ExhibitionsPurchasePage.jsx";
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
import EmployeeLayout from "./pages/employee/EmployeeLayout.jsx";
import Dashboard from "./pages/employee/Dashboard.jsx";
import Settings from "./pages/employee/Settings.jsx";
import RegisterEmployee from "./pages/employee/RegisterEmployee.jsx";
import EditEmployee from "./pages/employee/EditEmployee.jsx";
import EmployeeList from "./pages/employee/EmployeeList.jsx";
import CustomerList from "./pages/employee/CustomerList.jsx";
import CategoryLog from "./components/CategoryLog.jsx";
import Reports from "./pages/employee/reports/Reports.jsx";
import ResetpasswordPage from "./pages/ResetpasswordPage.jsx";
import PasswordresetrequestPage from "./pages/PasswordresetrequestPage.jsx";
import ViewprofilePage from "./pages/ViewprofilePage.jsx";
import EditreviewPage from "./pages/EditreviewPage.jsx";
import PurchaseHistoryLayout from "./pages/PurchaseHistoryLayout.jsx";
import PurchaseHistoryLog from "./components/PurchaseHistoryLog.jsx";
import PurchaseHistoryPage from "./pages/PurchaseHistoryPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import ToursPage from "./pages/ToursPage.jsx";
import AccessibilityPage from "./pages/AccessibilityPage.jsx";
import ParkingPage from "./pages/ParkingPage.jsx";
import Tasks from "./pages/employee/Tasks.jsx";

const Layout = (props) => {
  const formData = props.FD;
  const setFormData = props.setFD;
  return (
    <div>
      <TicketFormDataContext.Provider value={{ formData, setFormData }}>
        <Outlet />
      </TicketFormDataContext.Provider>
    </div>
  );
};

const App = () => {
  const [formData, setFormData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const getSelectedDate = (data) => {
    setSelectedDate(data);
  };

  return (
    <AuthProvider>
      <Routes>
        {/* Unprotected Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/resetpassword" element={<ResetpasswordPage />} />
        <Route
          path="/passwordresetrequest"
          element={<PasswordresetrequestPage />}
        />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collection/:id" element={<CollectionsViewPage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/exhibition/:id" element={<ExhibitionViewPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/shop" element={<GiftShopPage />} />
        <Route path="/shop/:prodCatID" element={<GiftShopCategoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/parking" element={<ParkingPage />} />

        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            <EmployeeProtectedRoute>
              {" "}
              {/* Protect employee routes */}
              <EmployeeLayout />
            </EmployeeProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="settings" element={<Settings />}>
            <Route index element={<Navigate to="exhibition" replace />} />
            <Route path=":category" element={<CategoryLog />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="reports"
            element={
              <AdminProtectedRoute>
                {" "}
                {/* Protect admin routes */}
                <Reports />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="register"
            element={
              <AdminProtectedRoute>
                {" "}
                {/* Protect register employee route */}
                <RegisterEmployee />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <AdminProtectedRoute>
                {" "}
                {/* Protect edit employee route */}
                <EditEmployee />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="employees"
            element={
              <AdminProtectedRoute>
                {" "}
                {/* Protect employee list route */}
                <EmployeeList />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="customerlist"
            element={
              <AdminProtectedRoute>
                {" "}
                {/* Protect customer list route */}
                <CustomerList />
              </AdminProtectedRoute>
            }
          />
        </Route>
        {/* Protected Routes */}
        <Route element={<Layout FD={formData} setFD={setFormData} />}>
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketPage onNext={getSelectedDate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/exhibitions"
            element={
              <ProtectedRoute>
                <ExhibitionsPurchasePage selDate={selectedDate} />
              </ProtectedRoute>
            }
          />
        </Route>
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
        <Route
          path="/shop/:prodCatID/:prodID"
          element={
            <ProtectedRoute>
              <GiftShopProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ViewprofilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editreview"
          element={
            <ProtectedRoute>
              <EditreviewPage />
            </ProtectedRoute>
          }
        />
        {/*<Route
          path="/purchasehistory"
          element={
            <ProtectedRoute>
              <PurchaseHistoryPage />
            </ProtectedRoute>
          }
        />*/}
        <Route
          path="/purchasehistory"
          element={
            <ProtectedRoute>
              {" "}
              {/* Protect employee routes */}
              <PurchaseHistoryLayout />
            </ProtectedRoute>
          }
        >
          <Route element={<PurchaseHistoryPage />}>
            <Route index element={<Navigate to="ticket" replace />} />
            <Route path=":category" element={<PurchaseHistoryLog />} />
          </Route>
        </Route>
    </Routes>
    </AuthProvider>
  );
};

export default App;
