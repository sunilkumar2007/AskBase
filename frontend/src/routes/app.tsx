import React from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '@/layouts/AppLayout';
import { useAuthStore } from '@/stores/useAuthStore';

export const Route = createFileRoute('/app')({
  beforeLoad: ({ location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: AppLayout,
});
