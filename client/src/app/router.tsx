import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../features/home/HomePage';
import { ScholarshipExplorerPage } from '../features/catalog/ScholarshipExplorerPage';
import { ScholarshipDetailsPage } from '../features/details/ScholarshipDetailsPage';
import { GuidedMatchFinderPage } from '../features/questionnaire/GuidedMatchFinderPage';
import { MatchResultsPage } from '../features/matches/MatchResultsPage';
import { PlansListPage } from '../features/plans/PlansListPage';
import { PlanDetailPage } from '../features/plans/PlanDetailPage';
import { HelpPage } from '../features/support/HelpPage';
import { PrivacyPage } from '../features/support/PrivacyPage';

// P1 Authentication & Student Management
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { VerifyEmailPage } from '../features/auth/VerifyEmailPage';
import { StudentDashboardPage } from '../features/dashboard/StudentDashboardPage';
import { StudentProfilePage } from '../features/profile/StudentProfilePage';
import { SavedScholarshipsPage } from '../features/saved/SavedScholarshipsPage';
import { ApplicationTrackerPage } from '../features/applications/ApplicationTrackerPage';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { NotificationsPage } from '../features/notifications/NotificationsPage';
import { ResourceLibraryPage } from '../features/resources/ResourceLibraryPage';
import { ResourceDetailPage } from '../features/resources/ResourceDetailPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';

// P2 Advanced Capabilities
import { ComparisonPage } from '../features/comparison/ComparisonPage';
import { AdvisorDirectoryPage } from '../features/advisors/AdvisorDirectoryPage';

export const router = createBrowserRouter([
  // P0 Screens
  {
    path: '/',
    element: (
      <AppLayout>
        <HomePage />
      </AppLayout>
    ),
  },
  {
    path: '/scholarships',
    element: (
      <AppLayout>
        <ScholarshipExplorerPage />
      </AppLayout>
    ),
  },
  {
    path: '/scholarships/:slug',
    element: (
      <AppLayout>
        <ScholarshipDetailsPage />
      </AppLayout>
    ),
  },
  {
    path: '/find',
    element: (
      <AppLayout>
        <GuidedMatchFinderPage />
      </AppLayout>
    ),
  },
  {
    path: '/matches',
    element: (
      <AppLayout>
        <MatchResultsPage />
      </AppLayout>
    ),
  },
  {
    path: '/plans',
    element: (
      <AppLayout>
        <PlansListPage />
      </AppLayout>
    ),
  },
  {
    path: '/plans/:id',
    element: (
      <AppLayout>
        <PlanDetailPage />
      </AppLayout>
    ),
  },
  {
    path: '/help',
    element: (
      <AppLayout>
        <HelpPage />
      </AppLayout>
    ),
  },
  {
    path: '/privacy',
    element: (
      <AppLayout>
        <PrivacyPage />
      </AppLayout>
    ),
  },

  // P1 Authentication Routes
  {
    path: '/login',
    element: (
      <AppLayout>
        <LoginPage />
      </AppLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AppLayout>
        <RegisterPage />
      </AppLayout>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <AppLayout>
        <VerifyEmailPage />
      </AppLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AppLayout>
        <ForgotPasswordPage />
      </AppLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AppLayout>
        <ForgotPasswordPage />
      </AppLayout>
    ),
  },

  // P1 Student Workspace & Operations
  {
    path: '/dashboard',
    element: (
      <AppLayout>
        <StudentDashboardPage />
      </AppLayout>
    ),
  },
  {
    path: '/profile',
    element: (
      <AppLayout>
        <StudentProfilePage />
      </AppLayout>
    ),
  },
  {
    path: '/saved',
    element: (
      <AppLayout>
        <SavedScholarshipsPage />
      </AppLayout>
    ),
  },
  {
    path: '/applications',
    element: (
      <AppLayout>
        <ApplicationTrackerPage />
      </AppLayout>
    ),
  },
  {
    path: '/calendar',
    element: (
      <AppLayout>
        <CalendarPage />
      </AppLayout>
    ),
  },
  {
    path: '/notifications',
    element: (
      <AppLayout>
        <NotificationsPage />
      </AppLayout>
    ),
  },
  {
    path: '/resources',
    element: (
      <AppLayout>
        <ResourceLibraryPage />
      </AppLayout>
    ),
  },
  {
    path: '/resources/:slug',
    element: (
      <AppLayout>
        <ResourceDetailPage />
      </AppLayout>
    ),
  },
  {
    path: '/settings',
    element: (
      <AppLayout>
        <SettingsPage />
      </AppLayout>
    ),
  },
  {
    path: '/admin/*',
    element: (
      <AppLayout>
        <AdminDashboardPage />
      </AppLayout>
    ),
  },

  // P2 Advanced Capabilities
  {
    path: '/compare',
    element: (
      <AppLayout>
        <ComparisonPage />
      </AppLayout>
    ),
  },
  {
    path: '/advisors',
    element: (
      <AppLayout>
        <AdvisorDirectoryPage />
      </AppLayout>
    ),
  },

  // Fallback Wildcard
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
