import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage";

import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { PermissionRoute } from "../components/common/PermissionRoute";
import AppLayout from "../components/layout/AppLayout";
import TicketsPage from "../pages/tickets/TicketsPage";
import CreateTicketPage from "../pages/tickets/CreateTicketPage";
import TicketDetailsPage from "../pages/tickets/TicketDetailsPage";

import UsersPage from "../pages/users/UsersPage";
import CategoriesPage from "../pages/categories/CategoriesPage";

import ProfilePage from "../pages/profile/ProfilePage";
import ReportsPage from "../pages/reports/ReportsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/app/dashboard"
            element={<DashboardPage />}
          />
          <Route
            path="/app/tickets"
            element={
              <PermissionRoute permission="tickets:view_own">
                <TicketsPage />
              </PermissionRoute>
            }
          />
          <Route 
            path="/app/tickets/new" 
            element={
            <PermissionRoute permission="tickets:create">
              <CreateTicketPage />
            </PermissionRoute>
            }
            />
            <Route 
            path="/app/tickets/:ticketId" 
            element={
            <PermissionRoute permission="tickets:view_own">
              <TicketDetailsPage />
            </PermissionRoute>
            }
            />

            <Route 
            path="/app/users" 
            element={
            <PermissionRoute permission="users:manage">
              <UsersPage />
            </PermissionRoute>
            }
            />

            <Route 
            path="/app/categories"
            element={
            <PermissionRoute permission="categories:manage">
              <CategoriesPage />
            </PermissionRoute>
            }
            />

          <Route 
          path="/app/reports"
          element={
          <PermissionRoute permission="reports:view">
            <ReportsPage />
          </PermissionRoute>
        }
        />

          <Route
          path="/app/profile"
          element={<ProfilePage />}
          />
          </Route>
        </Route>

      <Route
        path="/"
        element={
          <Navigate
            to="/app/dashboard"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/app/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}