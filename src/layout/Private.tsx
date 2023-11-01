import React, { useCallback, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { RouteUrl } from '../routes';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import clsx from 'clsx';
import { BiSolidReport } from 'react-icons/bi';
import { MdInventory, MdDashboard } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa6';
import { RiSettings2Fill } from 'react-icons/ri';
import { PiSignOutBold } from 'react-icons/pi';
import { CustomButton } from '../components';
import { signOut } from '../Redux/loginSlice';

export default function Private() {
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.admin);
  const links = [
    {
      id: 0,
      name: 'Dashboard',
      url: RouteUrl.DASHBOARD,
      icon: <MdDashboard />,
    },
    {
      id: 1,
      name: 'Inventory',
      url: RouteUrl.INVENTORY,
      icon: <BiSolidReport />,
    },
    { id: 2, name: 'Reports', url: RouteUrl.REPORTS, icon: <MdInventory /> },
    { id: 3, name: 'Users', url: RouteUrl.USERS, icon: <FaUsers /> },
    {
      id: 4,
      name: 'Maintenance',
      url: RouteUrl.MAINTENANCE,
      icon: <RiSettings2Fill />,
    },
  ];

  const [selectedMenu, setSelectedMenu] = useState({
    id: 0,
  }) as any;

  const onSelectedMenu = useCallback((item: any) => {
    setSelectedMenu({ ...item });
  }, []);

  const logOut = () => {
    dispatch(signOut());
  };

  return _.isNil(admin?.info) ? (
    <Navigate replace to={RouteUrl.HOME} />
  ) : (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-pink-700 w-60 h-screen text-white flex flex-col justify-between ">
        <div className="w-full">
          <div className="w-full p-5">
            <h3 className="">Hello,</h3>
            <h1 className="text-white text-2xl truncate font-extrabold">
              {admin.info && `${admin.info.First_Name} ${admin.info.Last_Name}`}
            </h1>
            <h5 className="text-white">
              {admin.info && admin.info.Email_Address}
            </h5>
          </div>
          <div className="bg-white h-[1px]"></div>
          <div className="flex flex-col w-full">
            {links.map((link, idx) => (
              <div
                className={clsx(
                  'p-3 w-full flex items-center gap-3',
                  selectedMenu?.id === link.id ? 'bg-gray-800' : '',
                )}
                key={idx}
              >
                {link.icon}
                <Link
                  key={idx}
                  to={link.url}
                  onClick={() => onSelectedMenu(link)}
                >
                  {link.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CustomButton
            icon={<PiSignOutBold />}
            children="Sign Out"
            addedClass="w-full bg-gray-800 text-white rounded-none hover:transform-none"
            onClick={logOut}
          />
        </div>
      </div>
      {/* Body */}
      <div className="flex h-screen flex-1 w-screen flex-col">
        <nav>
          <h1 className="bg-gray-800 text-white p-5">Welcome</h1>
        </nav>
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
