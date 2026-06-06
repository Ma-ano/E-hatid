// src/App.tsx
import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ThemeProvider } from './context/ThemeContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';
import './theme/global.css';

/* Pages */
import GuestHome from './pages/Guest/Home';
import StallDetail from './pages/Guest/StallDetail';
import GuestCart from './pages/Guest/Cart';
import GuestLocationPicker from './pages/Guest/LocationPicker';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RiderLogin from './pages/Auth/RiderLogin';
import RiderRegister from './pages/Auth/RiderRegister';
import AdminLogin from './pages/Auth/AdminLogin';
import AdminRegister from './pages/Auth/AdminRegister';
import UserHome from './pages/User/Home';
import UserProfile from './pages/User/Profile';
import UserCart from './pages/User/Cart';
import UserLocationPicker from './pages/User/LocationPicker';
import RiderHome from './pages/Rider/Home';
import RiderOrders from './pages/Rider/Orders';
import RiderEarnings from './pages/Rider/Earnings';
import RiderProfile from './pages/Rider/Profile';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminRiders from './pages/Admin/Riders';
import AdminOrders from './pages/Admin/Orders';
import AdminReports from './pages/Admin/Reports';
import VendorLogin from './pages/Auth/VendorLogin';
import VendorRegister from './pages/Auth/VendorRegister';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import VendorProducts from './pages/Vendor/VendorProducts';
import VendorOrders from './pages/Vendor/VendorOrders';
import VendorEarnings from './pages/Vendor/VendorEarnings';
import VendorReviews from './pages/Vendor/VendorReviews';
import VendorSettings from './pages/Vendor/VendorSettings';
import ActivityLog from './pages/Activities/ActivityLog';
import Messages from './pages/Messages/Messages';
import ReportIncident from './pages/Reports/ReportIncident';
import OrderTracking from './pages/User/OrderTracking';
import UserOrders from './pages/User/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import StorageConsent from './components/StorageConsent';
import ThemeToggle from './components/ThemeToggle';

setupIonicReact({
  mode: 'ios',
  animated: false,
});

const App: React.FC = () => (
  <IonApp>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
          <IonReactRouter>
            <IonRouterOutlet>
              {/* Guest Routes */}
              <ProtectedRoute exact path="/guest/home" component={GuestHome} requireAuth={false} />
              <Route exact path="/stall/:id/menu" component={StallDetail} />
              <ProtectedRoute exact path="/guest/cart" component={GuestCart} requireAuth={false} />
              <ProtectedRoute exact path="/guest/location" component={GuestLocationPicker} requireAuth={false} />
              
              {/* User Routes */}
              <ProtectedRoute exact path="/user/home" component={UserHome} />
              <ProtectedRoute exact path="/user/profile" component={UserProfile} />
              <ProtectedRoute exact path="/user/cart" component={UserCart} />
              <ProtectedRoute exact path="/user/orders" component={UserOrders} />
              <ProtectedRoute exact path="/user/location" component={UserLocationPicker} />
              
              {/* Rider Routes */}
              <ProtectedRoute exact path="/rider/home" component={RiderHome} requiredRole="rider" />
              <ProtectedRoute exact path="/rider/orders" component={RiderOrders} requiredRole="rider" />
              <ProtectedRoute exact path="/rider/earnings" component={RiderEarnings} requiredRole="rider" />
              <ProtectedRoute exact path="/rider/profile" component={RiderProfile} requiredRole="rider" />
              <ProtectedRoute exact path="/rider/login" component={RiderLogin} requireAuth={false} />
              <ProtectedRoute exact path="/rider/register" component={RiderRegister} requireAuth={false} />
              
              {/* Admin Routes */}
              <ProtectedRoute exact path="/admin/dashboard" component={AdminDashboard} requiredRole="admin" />
              <ProtectedRoute exact path="/admin/users" component={AdminUsers} requiredRole="admin" />
              <ProtectedRoute exact path="/admin/riders" component={AdminRiders} requiredRole="admin" />
              <ProtectedRoute exact path="/admin/orders" component={AdminOrders} requiredRole="admin" />
              <ProtectedRoute exact path="/admin/reports" component={AdminReports} requiredRole="admin" />
              <ProtectedRoute exact path="/admin/login" component={AdminLogin} requireAuth={false} />
              <ProtectedRoute exact path="/admin/register" component={AdminRegister} requireAuth={false} />
              
              {/* Vendor Routes */}
              <ProtectedRoute exact path="/vendor/dashboard" component={VendorDashboard} requiredRole="vendor" />
              <ProtectedRoute exact path="/vendor/products" component={VendorProducts} requiredRole="vendor" />
              <ProtectedRoute exact path="/vendor/orders" component={VendorOrders} requiredRole="vendor" />
              <ProtectedRoute exact path="/vendor/earnings" component={VendorEarnings} requiredRole="vendor" />
              <ProtectedRoute exact path="/vendor/reviews" component={VendorReviews} requiredRole="vendor" />
              <ProtectedRoute exact path="/vendor/settings" component={VendorSettings} requiredRole="vendor" />
              <ProtectedRoute exact path="/vendor/login" component={VendorLogin} requireAuth={false} />
              <ProtectedRoute exact path="/vendor/register" component={VendorRegister} requireAuth={false} />

              {/* Activity & Messages Routes */}
              <Route exact path="/activities" component={ActivityLog} />
              <Route exact path="/messages" component={Messages} />
              
              {/* Report Routes */}
              <Route exact path="/report" component={ReportIncident} />
              
              {/* Order Tracking */}
              <ProtectedRoute exact path="/user/order-tracking" component={OrderTracking} />
              
              {/* Auth Routes - User */}
              <ProtectedRoute exact path="/user/login" component={Login} requireAuth={false} />
              <ProtectedRoute exact path="/user/register" component={Register} requireAuth={false} />
              
              {/* Backward compatibility redirects */}
              <Route exact path="/login" render={() => <Redirect to="/user/login" />} />
              <Route exact path="/register" render={() => <Redirect to="/user/register" />} />
              <Route exact path="/guest/stall/:id" render={({match}) => <Redirect to={`/stall/${(match.params as any).id}/menu`} />} />
              
              {/* Default Redirect — guests see welcome page, logged-in users go to home */}
              <ProtectedRoute exact path="/" component={GuestHome} requireAuth={false} />
            </IonRouterOutlet>
          </IonReactRouter>
          <StorageConsent />
          <ThemeToggle />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </IonApp>
);

export default App;