import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext.tsx'
import { RootLayout } from './components/RootLayout.tsx'
import { Login } from './components/Login.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import { Posts } from './components/Posts.tsx'
import { SinglePost } from './components/SinglePost.tsx'
import { Register } from './components/Register.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider>
      <RootLayout />
    </AuthProvider>,
    children: [
      {
        path: 'posts/:page?',
        element: <PrivateRoute><Posts /></PrivateRoute>
      },
      {
        path: "login",
        element:
          <Login />
      },
      {
        path: "register",
        element:
          <Register />
      },
      {
        path: 'post/:id',
        element: <PrivateRoute><SinglePost /></PrivateRoute>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
