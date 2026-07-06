import { useCallback, useEffect, useState } from 'react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

export const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }

    setNotifications((prev) => [...prev, newNotification])

    if (notification.duration !== undefined && notification.duration > 0) {
      setTimeout(() => removeNotification(id), notification.duration)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

function Notification({ notification }: { notification: Notification }) {
  const colors: Record<string, string> = {
    success: 'bg-green-100 border-green-300 text-green-800',
    error: 'bg-red-100 border-red-300 text-red-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  }

  const icons: Record<string, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }

  return (
    <div className={`border rounded-lg p-4 ${colors[notification.type]}`}>
      <div className="flex items-center gap-2">
        <span>{icons[notification.type]}</span>
        <p>{notification.message}</p>
      </div>
    </div>
  )
}

import React from 'react'

export function useNotification() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
