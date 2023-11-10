import React from 'react';
import { RouteUrl } from './routes';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Error, Inventory, Login, Maintenance, Reports, Users } from './pages';
import { Public, Private } from './layout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './Redux/store';

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
        // {
        //   path: RouteUrl.DASHBOARD,
        //   element: <Dashboard />,
        // },
        {
          path: RouteUrl.INVENTORY,
          element: <Inventory />,
        },
        {
          path: RouteUrl.REPORTS,
          element: <Reports />,
        },
        {
          path: RouteUrl.USERS,
          element: <Users />,
        },
        {
          path: RouteUrl.MAINTENANCE,
          element: <Maintenance />,
        },
      ],
    },
  ]);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} fallbackElement={<h6>Loading...</h6>} />
      </PersistGate>
    </Provider>
  );
}
