import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  orderId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotifications = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => set((state) => {
        const newNotification = {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        const updatedNotifications = [newNotification, ...state.notifications];
        return {
          notifications: updatedNotifications,
          unreadCount: state.unreadCount + 1,
        };
      }),

      markAsRead: (id) => set((state) => {
        const updatedNotifications = state.notifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        );
        return {
          notifications: updatedNotifications,
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      }),

      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0,
      })),

      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notifications-store',
    }
  )
);

// Initialize real-time subscription
let subscription: ReturnType<typeof supabase.channel> | null = null;

export function initializeNotifications(userId: string) {
  // Clean up existing subscription if any
  if (subscription) {
    subscription.unsubscribe();
  }

  // Create new subscription
  subscription = supabase
    .channel('order-status-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const { new: updatedOrder, old: oldOrder } = payload;
        
        // Only notify if status has changed
        if (updatedOrder.status !== oldOrder.status) {
          let message = '';
          switch (updatedOrder.status) {
            case 'processing':
              message = 'جاري تجهيز طلبك رقم #' + updatedOrder.id.slice(0, 8);
              break;
            case 'completed':
              message = 'تم اكتمال طلبك رقم #' + updatedOrder.id.slice(0, 8);
              break;
            case 'cancelled':
              message = 'تم إلغاء طلبك رقم #' + updatedOrder.id.slice(0, 8);
              break;
          }

          if (message) {
            useNotifications.getState().addNotification({
              orderId: updatedOrder.id,
              message,
              read: false,
            });
          }
        }
      }
    )
    .subscribe();

  return () => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  };
}