import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RouteUrl } from '../routes';
import _ from 'lodash';
import { useSelector } from "react-redux";
import { RootState } from '../Redux/store';

export default function Private() {
  const { admin } = useSelector((state: RootState) => state.login);
  return _.isNil(admin) ? <Navigate replace to={RouteUrl.HOME} /> : <Outlet />;
}
