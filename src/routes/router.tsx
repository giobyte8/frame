import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { GallerySkeleton } from '../components/gallery/GallerySkeleton';
import AppLayout from './AppLayout';

const GridGalleryPage = lazy(() => import('./GridGalleryPage'));
const MasonryGalleryPage = lazy(() => import('./MasonryGalleryPage'));

function withSuspense(node: ReactNode): ReactNode {
  return <Suspense fallback={<GallerySkeleton />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<GridGalleryPage />),
      },
      {
        path: 'masonry',
        element: withSuspense(<MasonryGalleryPage />),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
