import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import CreateWishPage from './pages/CreateWishPage';
import ViewWishPage from './pages/ViewWishPage';
import EditWishPage from './pages/EditWishPage';
import BouquetMakerPage from './pages/BouquetMakerPage';
import ViewBouquetPage from './pages/ViewBouquetPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const createWishRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-wish',
  component: CreateWishPage,
});

const viewWishRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wish/$wishId',
  component: ViewWishPage,
});

const editWishRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wish/$wishId/edit',
  component: EditWishPage,
});

const bouquetMakerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bouquet-maker',
  component: BouquetMakerPage,
});

const viewBouquetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bouquet/$bouquetId',
  component: ViewBouquetPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  createWishRoute,
  viewWishRoute,
  editWishRoute,
  bouquetMakerRoute,
  viewBouquetRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
