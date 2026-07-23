import React, { Suspense, lazy } from 'react';
import { IonApp, IonRouterOutlet, IonSpinner, IonPage, IonContent, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { AppLayout, RoleLayout } from './layouts';

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
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminReports = lazy(() => import('./pages/Admin/Reports'));
const VendorApply = lazy(() => import('./pages/apply/ApplyVendor'));
const RiderApply = lazy(() => import('./pages/apply/ApplyRider'));
const VendorDashboard = lazy(() => import('./pages/Vendor/VendorDashboard'));
const VendorProducts = lazy(() => import('./pages/Vendor/VendorProducts'));
const VendorOrders = lazy(() => import('./pages/Vendor/VendorOrders'));
const VendorEarnings = lazy(() => import('./pages/Vendor/VendorEarnings'));
const VendorReviews = lazy(() => import('./pages/Vendor/VendorReviews'));
const VendorSettings = lazy(() => import('./pages/Vendor/VendorSettings'));
const ActivityLog = lazy(() => import('./pages/Activities/ActivityLog'));
const Messages = lazy(() => import('./pages/Messages/Messages'));
const ReportIncident = lazy(() => import('./pages/Reports/ReportIncident'));
const RoleSelection = lazy(() => import('./pages/Auth/RoleSelection'));
const EmailVerification = lazy(() => import('./pages/Auth/EmailVerification'));
const OtpVerification = lazy(() => import('./pages/Auth/OtpVerification'));
const ApprovalPending = lazy(() => import('./pages/Auth/ApprovalPending'));
const ApplicationRejected = lazy(() => import('./pages/Auth/ApplicationRejected'));
import ProtectedRoute from './components/ProtectedRoute';
import StorageConsent from './components/StorageConsent';

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

const L: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppLayout><RoleLayout>{children}</RoleLayout></AppLayout>
);

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Suspense fallback={<PageLoader />}>
        <IonRouterOutlet>
          {/* Landing - standalone, no layout wrapper */}
          <Route exact path="/">
            <IonPage>
              <IonContent className="ion-content-center">
                <Landing />
              </IonContent>
            </IonPage>
          </Route>

          {/* Guest Routes */}
          <ProtectedRoute exact path="/guest/home" requireAuth={false}>
            <L><CustomerHome /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/guest/cart" requireAuth={false}>
            <L><GuestCart /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/guest/location" requireAuth={false}>
            <L><GuestLocationPicker /></L>
          </ProtectedRoute>

          {/* Stall Detail (public) */}
          <Route exact path="/stall/:id/menu">
            <L><StallDetail /></L>
          </Route>

          {/* Customer Routes */}
          <ProtectedRoute exact path="/customer/home" requiredRole="customer">
            <L><CustomerHome /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/customer/profile" requiredRole="customer">
            <L><CustomerProfile /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/customer/cart" requiredRole="customer">
            <L><CustomerCart /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/customer/orders" requiredRole="customer">
            <L><CustomerOrders /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/customer/location" requiredRole="customer">
            <L><CustomerLocationPicker /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/customer/order-tracking" requiredRole="customer">
            <L><CustomerOrderTracking /></L>
          </ProtectedRoute>

          {/* Auth Routes */}
          <ProtectedRoute exact path="/login" requireAuth={false}>
            <L><Login /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/register" requireAuth={false}>
            <L><Register /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/select-role" requireAuth={true}>
            <L><RoleSelection /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/verify-email" requireAuth={true}>
            <Redirect to="/verify-otp" />
          </ProtectedRoute>
          <ProtectedRoute exact path="/approval-pending" requireAuth={true}>
            <IonPage><IonContent className="ion-content-center"><ApprovalPending /></IonContent></IonPage>
          </ProtectedRoute>
          <ProtectedRoute exact path="/application-rejected" requireAuth={true}>
            <IonPage><IonContent className="ion-content-center"><ApplicationRejected /></IonContent></IonPage>
          </ProtectedRoute>
          <ProtectedRoute exact path="/verify-otp" requireAuth={true}>
            <L><OtpVerification /></L>
          </ProtectedRoute>

          {/* Apply Routes */}
          <ProtectedRoute exact path="/apply/vendor" requireAuth={true}>
            <IonPage><IonContent className="ion-content-center"><VendorApply /></IonContent></IonPage>
          </ProtectedRoute>
          <ProtectedRoute exact path="/apply/rider" requireAuth={true}>
            <IonPage><IonContent className="ion-content-center"><RiderApply /></IonContent></IonPage>
          </ProtectedRoute>

          {/* Rider Routes */}
          <ProtectedRoute exact path="/rider/home" requiredRole="rider">
            <L><RiderHome /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/rider/orders" requiredRole="rider">
            <L><RiderOrders /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/rider/earnings" requiredRole="rider">
            <L><RiderEarnings /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/rider/profile" requiredRole="rider">
            <L><RiderProfile /></L>
          </ProtectedRoute>

          {/* Admin Routes */}
          <ProtectedRoute exact path="/admin/dashboard" requiredRole="admin">
            <L><AdminDashboard /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/admin/users" requiredRole="admin">
            <L><AdminUsers /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/admin/orders" requiredRole="admin">
            <L><AdminOrders /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/admin/reports" requiredRole="admin">
            <L><AdminReports /></L>
          </ProtectedRoute>

          {/* Vendor Routes */}
          <ProtectedRoute exact path="/vendor/dashboard" requiredRole="vendor">
            <L><VendorDashboard /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/vendor/products" requiredRole="vendor">
            <L><VendorProducts /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/vendor/orders" requiredRole="vendor">
            <L><VendorOrders /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/vendor/earnings" requiredRole="vendor">
            <L><VendorEarnings /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/vendor/reviews" requiredRole="vendor">
            <L><VendorReviews /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/vendor/settings" requiredRole="vendor">
            <L><VendorSettings /></L>
          </ProtectedRoute>

          {/* Activity & Messages Routes */}
          <ProtectedRoute exact path="/activities" requireAuth={true}>
            <L><ActivityLog /></L>
          </ProtectedRoute>
          <ProtectedRoute exact path="/messages" requireAuth={true}>
            <L><Messages /></L>
          </ProtectedRoute>

          {/* Report Routes */}
          <ProtectedRoute exact path="/report" requireAuth={true}>
            <L><ReportIncident /></L>
          </ProtectedRoute>

          {/* Legacy redirects */}
          <Route exact path="/guest/stall/:id" render={({match}) => <Redirect to={`/stall/`+(match.params as any).id+`/menu`} />} />
        </IonRouterOutlet>
      </Suspense>
      <StorageConsent />
    </IonReactRouter>
  </IonApp>
);

export default App;
