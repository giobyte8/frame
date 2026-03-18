import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Skeleton } from 'antd';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';

const LandingPage = lazy(() => import('./LandingPage'));
const GalleryPage = lazy(() => import('./GalleryPage'));

function withSuspense(node: ReactNode): ReactNode {
  return <Suspense fallback={<Skeleton active paragraph={{ rows: 10 }} />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/root/" replace />,
      },
      {
        path: 'root',
        element: withSuspense(<LandingPage />),
      },
      {
        path: 'gallery/:directoryId',
        element: withSuspense(<GalleryPage />),
      },
      {
        path: '*',
        element: <Navigate to="/root/" replace />,
      },
    ],
  },
]);
