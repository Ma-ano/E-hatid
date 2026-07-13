import React, { Suspense, lazy } from 'react';
import { IonApp, IonRouterOutlet, IonSpinner, IonPage, IonContent, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ThemeProvider } from './context/ThemeContext';
import { GuestLayout, CustomerLayout, RiderLayout, AdminLayout, VendorLayout } from './layouts';

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

/* Lazy-loaded pages */
const Landing = lazy(() => import('./pages/Guest/Landing'));
const CustomerHome = lazy(() => import('./pages/customer/Home'));
const StallDetail = lazy(() => import('./pages/Guest/StallDetail'));
const GuestCart = lazy(() => import('./pages/Guest/Cart'));
const GuestLocationPicker = lazy(() => import('./pages/Guest/LocationPicker'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const RiderLogin = lazy(() => import('./pages/Auth/RiderLogin'));
const RiderRegister = lazy(() => import('./pages/Auth/RiderRegister'));
const AdminLogin = lazy(() => import('./pages/Auth/AdminLogin'));
const AdminRegister = lazy(() => import('./pages/Auth/AdminRegister'));
const CustomerProfile = lazy(() => import('./pages/customer/Profile'));
const CustomerCart = lazy(() => import('./pages/customer/Cart'));
const CustomerLocationPicker = lazy(() => import('./pages/customer/LocationPicker'));
const CustomerOrders = lazy(() => import('./pages/customer/Orders'));
const CustomerOrderTracking = lazy(() => import('./pages/customer/OrderTracking'));
const RiderHome = lazy(() => import('./pages/Rider/Home'));
const RiderOrders = lazy(() => import('./pages/Rider/Orders'));
const RiderEarnings = lazy(() => import('./pages/Rider/Earnings'));
const RiderProfile = lazy(() => import('./pages/Rider/Profile'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/Admin/Users'));
const AdminRiders = lazy(() => import('./pages/Admin/Riders'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminReports = lazy(() => import('./pages/Admin/Reports'));
const VendorLogin = lazy(() => import('./pages/Auth/VendorLogin'));
const VendorRegister = lazy(() => import('./pages/Auth/VendorRegister'));
const VendorDashboard = lazy(() => import('./pages/Vendor/VendorDashboard'));
const VendorProducts = lazy(() => import('./pages/Vendor/VendorProducts'));
const VendorOrders = lazy(() => import('./pages/Vendor/VendorOrders'));
const VendorEarnings = lazy(() => import('./pages/Vendor/VendorEarnings'));
const VendorReviews = lazy(() => import('./pages/Vendor/VendorReviews'));
const VendorSettings = lazy(() => import('./pages/Vendor/VendorSettings'));
const ActivityLog = lazy(() => import('./pages/Activities/ActivityLog'));
const Messages = lazy(() => import('./pages/Messages/Messages'));
const ReportIncident = lazy(() => import('./pages/Reports/ReportIncident'));
import ProtectedRoute from './components/ProtectedRoute';
import StorageConsent from './components/StorageConsent';
import ThemeToggle from './components/ThemeToggle';

setupIonicReact({
  mode: 'ios',
  animated: false,
});

const PageLoader: React.FC = () => (
  <IonPage>
    <IonContent className="ion-content-center">
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[var(--ion-color-primary)]/10 flex items-center justify-center">
          <IonSpinner name="crescent" className="text-[var(--ion-color-primary)]" />
        </div>
      </div>
    </IonContent>
  </IonPage>
);

const App: React.FC = () => (
  <IonApp>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
          <IonReactRouter>
            <Suspense fallback={<PageLoader />}>
            <IonRouterOutlet>
              {/* Landing — standalone, no layout wrapper */}
              <Route exact path="/">
                <IonPage>
                  <IonContent className="ion-content-center">
                    <Landing />
                  </IonContent>
                </IonPage>
              </Route>

              {/* Guest Routes */}
              <ProtectedRoute exact path="/guest/home" requireAuth={false}>
                <GuestLayout><CustomerHome /></GuestLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/guest/cart" requireAuth={false}>
                <GuestLayout><GuestCart /></GuestLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/guest/location" requireAuth={false}>
                <GuestLayout><GuestLocationPicker /></GuestLayout>
              </ProtectedRoute>

              {/* Stall Detail (accessible to all) */}
              <Route exact path="/stall/:id/menu">
                <GuestLayout><StallDetail /></GuestLayout>
              </Route>

              {/* Customer Routes */}
              <ProtectedRoute exact path="/customer/home">
                <CustomerLayout><CustomerHome /></CustomerLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/customer/profile">
                <CustomerLayout><CustomerProfile /></CustomerLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/customer/cart">
                <CustomerLayout><CustomerCart /></CustomerLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/customer/orders">
                <CustomerLayout><CustomerOrders /></CustomerLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/customer/location">
                <CustomerLayout><CustomerLocationPicker /></CustomerLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/customer/order-tracking">
                <CustomerLayout><CustomerOrderTracking /></CustomerLayout>
              </ProtectedRoute>

              {/* Auth Routes */}
              <ProtectedRoute exact path="/login" requireAuth={false}>
                <Login />
              </ProtectedRoute>
              <ProtectedRoute exact path="/register" requireAuth={false}>
                <Register />
              </ProtectedRoute>

              {/* Rider Routes */}
              <ProtectedRoute exact path="/rider/home" requiredRole="rider">
                <RiderLayout><RiderHome /></RiderLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/rider/orders" requiredRole="rider">
                <RiderLayout><RiderOrders /></RiderLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/rider/earnings" requiredRole="rider">
                <RiderLayout><RiderEarnings /></RiderLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/rider/profile" requiredRole="rider">
                <RiderLayout><RiderProfile /></RiderLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/rider/login" requireAuth={false}>
                <RiderLogin />
              </ProtectedRoute>
              <ProtectedRoute exact path="/rider/register" requireAuth={false}>
                <RiderRegister />
              </ProtectedRoute>

              {/* Admin Routes */}
              <ProtectedRoute exact path="/admin/dashboard" requiredRole="admin">
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/admin/users" requiredRole="admin">
                <AdminLayout><AdminUsers /></AdminLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/admin/riders" requiredRole="admin">
                <AdminLayout><AdminRiders /></AdminLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/admin/orders" requiredRole="admin">
                <AdminLayout><AdminOrders /></AdminLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/admin/reports" requiredRole="admin">
                <AdminLayout><AdminReports /></AdminLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/admin/login" requireAuth={false}>
                <AdminLogin />
              </ProtectedRoute>
              <ProtectedRoute exact path="/admin/register" requireAuth={false}>
                <AdminRegister />
              </ProtectedRoute>

              {/* Vendor Routes */}
              <ProtectedRoute exact path="/vendor/dashboard" requiredRole="vendor">
                <VendorLayout><VendorDashboard /></VendorLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/vendor/products" requiredRole="vendor">
                <VendorLayout><VendorProducts /></VendorLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/vendor/orders" requiredRole="vendor">
                <VendorLayout><VendorOrders /></VendorLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/vendor/earnings" requiredRole="vendor">
                <VendorLayout><VendorEarnings /></VendorLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/vendor/reviews" requiredRole="vendor">
                <VendorLayout><VendorReviews /></VendorLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/vendor/settings" requiredRole="vendor">
                <VendorLayout><VendorSettings /></VendorLayout>
              </ProtectedRoute>
              <ProtectedRoute exact path="/vendor/login" requireAuth={false}>
                <VendorLogin />
              </ProtectedRoute>
              <ProtectedRoute exact path="/vendor/register" requireAuth={false}>
                <VendorRegister />
              </ProtectedRoute>

              {/* Activity & Messages Routes */}
              <Route exact path="/activities">
                <GuestLayout><ActivityLog /></GuestLayout>
              </Route>
              <Route exact path="/messages">
                <GuestLayout><Messages /></GuestLayout>
              </Route>

              {/* Report Routes */}
              <Route exact path="/report">
                <GuestLayout><ReportIncident /></GuestLayout>
              </Route>

              {/* Legacy redirects */}
              <Route exact path="/guest/stall/:id" render={({match}) => <Redirect to={`/stall/${(match.params as any).id}/menu`} />} />
            </IonRouterOutlet>
            </Suspense>
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
