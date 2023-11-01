import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RouteUrl } from '../routes';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

export default function Public() {
  const admin = useSelector((state: RootState) => state.admin);
  return !_.isNil(admin.info) ? (
    <Navigate to={RouteUrl.DASHBOARD} replace />
  ) : (
    <Outlet />
  );
}
