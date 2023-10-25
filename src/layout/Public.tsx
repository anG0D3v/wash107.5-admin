import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RouteUrl } from '../routes';
import _ from 'lodash';

export default function Public() {
  const user: unknown = null;
  return !_.isNil(user) ? (
    <Navigate to={RouteUrl.DASHBOARD} replace />
  ) : (
    <Outlet />
  );
}
