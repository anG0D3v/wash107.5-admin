import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RouteUrl } from '../routes';
import _ from 'lodash';
import { useSelector } from "react-redux";
import { RootState } from '../Redux/store';

export default function Private() {
  const { isAuthenticated,admin } = useSelector((state: RootState) => state.login);
  // const user: unknown = null;
  console.log(admin)
  return _.isNil(admin) && isAuthenticated ? <Navigate replace to={RouteUrl.HOME} /> : <Outlet />;
}
