import { createFileRoute } from '@tanstack/react-router';
import NotificationsPage from '@/pages/NotificationsPage';

export const Route = createFileRoute('/app/notifications')({
  component: NotificationsPage,
});
