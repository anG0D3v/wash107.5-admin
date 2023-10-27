import React from 'react';
import { RouteUrl } from './routes';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Dashboard, Error, Login } from './pages';
import { Public, Private } from './layout';
import { Provider } from 'react-redux'; 
import store from './Redux/store';

export default function App() {
  const router = createBrowserRouter([
    {
      path: RouteUrl.HOME,
      element: <Public />,
      errorElement: <Error />,
      children: [
        {
          path: RouteUrl.HOME,
          element: <Login />,
        },
      ],
    },
    {
      path: RouteUrl.HOME,
      element: <Private />,
      errorElement: <Error />,
      children: [
        {
          path: RouteUrl.DASHBOARD,
          element: <Dashboard />,
        },
      ],
    },
  ]);
  return (
    <Provider store={store}>
    <RouterProvider router={router} fallbackElement={<h6>Loading...</h6>} />
    </Provider>
  );
}
