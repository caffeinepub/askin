import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
import DoubtsPage from './pages/DoubtsPage';
import DoubtDetailPage from './pages/DoubtDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';

function RootComponent() {
  const { identity } = useInternetIdentity();
  
  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-400">Welcome to Askin</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">Please log in to continue</p>
        </div>
      </div>
    );
  }
  
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
  return <RouterProvider router={router} />;
}
