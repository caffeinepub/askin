import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
import LoginScreen from './components/LoginScreen';
import DoubtsPage from './pages/DoubtsPage';
import DoubtDetailPage from './pages/DoubtDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';

function RootComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DoubtsPage,
});

const doubtDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doubt/$doubtId',
  component: DoubtDetailPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const routeTree = rootRoute.addChildren([indexRoute, doubtDetailRoute, leaderboardRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  // Show loading state while checking for stored identity
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!identity) {
    return <LoginScreen />;
  }

  // Show app with routing once authenticated
  return <RouterProvider router={router} />;
}
