import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import '@arco-design/web-react/dist/css/arco.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import Root from './pages/Root';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import People from './pages/People';
import Movie from './pages/Movie';
import ErrorPage from './pages/error-page';
import { AuthProvider } from './context/AuthContext';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'people/:id',
        element: <People />,
      },
      {
        path: 'movie/:id',
        element: <Movie />,
      },
      {
        path: 'auth/login',
        element: <Login />,
      },
      {
        path: 'auth/register',
        element: <Register />,
      },
    ],
  }]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
