import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LandingView } from '@/features/landing/components/LandingView';
import { WorkspaceView } from '@/features/workspace/components/WorkspaceView';
import { AuthView } from '@/features/auth/components/AuthView';
import { 
  FeaturesPage, 
  ExamplesPage, 
  PricingPage, 
  DocsPage, 
  EnterprisePage 
} from '@/features/pages/components/StaticPages';

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-bg-l0 p-6 text-center select-none font-sans">
    <h1 className="text-display text-primary">404</h1>
    <p className="mt-2 text-h2 text-white">Route not found</p>
    <p className="mt-1 text-xs text-slate-500 max-w-xs">The requested system pathway is invalid or has been re-indexed.</p>
    <a href="/" className="mt-4 rounded-lg bg-primary/20 text-primary border border-primary/30 px-4 py-2 text-xs font-semibold hover:bg-primary/30 transition-colors">
      Return to Operations
    </a>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingView />,
  },
  {
    path: '/auth',
    element: <AuthView />,
  },
  {
    path: '/features',
    element: <FeaturesPage />,
  },
  {
    path: '/examples',
    element: <ExamplesPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/docs',
    element: <DocsPage />,
  },
  {
    path: '/enterprise',
    element: <EnterprisePage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: 'workspace/:projectId',
        element: <WorkspaceView />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
export default router;
