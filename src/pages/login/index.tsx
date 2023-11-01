import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../db';
import laundryLogo from '../../assets/W1075LogoFinal.png';
import Eyeicon from '../../assets/eye.svg';
import Eyeslasesicon from '../../assets/eye-slash.svg';
import jeepLogo from '../../assets/jeeplogo.png';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../../Redux/loginSlice';
import { UserInfo } from '../../types/global';
import { useNavigate } from 'react-router-dom';
import { RouteUrl } from '../../routes';

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSeePassword, setIsSeePassword] = useState(false);
  const [userData, setUserData] = useState({ username: '', password: '' });
  const [listofUser, setListofUser] = useState<UserInfo[]>([]);

  const loadUsers = async () => {
    await getDocs(collection(db, 'userTable'))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setListofUser(newData as UserInfo[]);
      })
      .catch((error) => {
        console.error('Error loading users:', error);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSumbmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const checkuser = listofUser?.find(
      (user) =>
        user.Email_Address === userData.username && user.Role === 'ADMIN',
    );
    if (checkuser) {
      if ('Role' in checkuser && 'id' in checkuser && 'Password' in checkuser) {
        if (checkuser.Password === userData.password) {
          toast('Login successful!');
          dispatch(setAdmin(checkuser));
          navigate(RouteUrl.DASHBOARD);
        } else {
          toast('Incorrect password. Please try again.');
        }
      } else {
        toast('Incorrect password. Please try again.');
      }
    } else {
      toast('Incorrect password. Please try again.');
    }
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="text-primary relative w-screen h-screen">
        <img
          className="hidden md:flex md:basis-1/2 absolute right-8 top-98 bottom-0 z-negative-10"
          src={jeepLogo}
          alt=""
        />
        <img
          className="hidden md:flex md:basis-1/2 absolute left-10 top-98 bottom-0 z-negative-10"
          src={jeepLogo}
          alt=""
        />
        <div className="sm:h-2/3 absolute top-1/4 left-1/4 w-4/5 sm:w-1/2 bg-gray-800 h-96  rounded-md">
          <div className="relative w-94 h-max">
            <img
              className="w-32 absolute -left-7 -top-7 border-8 border-solid border-white rounded-full"
              src={laundryLogo}
              alt=""
            />
            <form
              onSubmit={handleSumbmit}
              className="z-10 flex flex-col items-center w-3/4 h-64 sm:h-94 absolute top-1/4 left-20 mt-4"
              action=""
            >
              <h1 className="text-4xl text-charcoalBlack font-bold">
                Welcome!
              </h1>
              <p className="text-charcoalBlack text-lg italic font-medium mb-6">
                Login to continue
              </p>
              <input
                className="mt-2 placeholder:text-lg placeholder:italic text-black placeholder:font-light block bg-white w-4/5 border border-vividOrange rounded py-4 px-5 shadow-sm focus:outline-none focus:border-vividOrange focus:ring-vividOrange focus:ring-1 sm:text-sm"
                type="email"
                placeholder="Email"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />
              <input
                className="text-black mt-2 placeholder:text-lg placeholder:italic placeholder:text-charcoalBlack placeholder:font-light block bg-white w-4/5 border border-vividOrange rounded py-4 px-5 shadow-sm focus:outline-none focus:border-vividOrange focus:ring-vividOrange focus:ring-1 sm:text-sm mb-4"
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => {
                  setIsSeePassword(!isSeePassword);
                }}
                className="absolute cursor-pointer inset-y-0 right-14 top-28 flex items-center pr-3"
              >
                {isSeePassword ? (
                  <img
                    src={Eyeicon}
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    src={Eyeslasesicon}
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </button>
              <div className="sm:w-3/4 w-3/4 flex flex-col-reverse justify-end items-end">
                <p className="text-charcoalBlack text-lg italic font-small text-center">
                  Don&apos;t have Account?{' '}
                  <a
                    href={'/signup'}
                    className="font-small underline underline-offset-4 transition-all hover:text-blue-500"
                  >
                    Sign Up
                  </a>
                </p>
                <a
                  href="/forgot-password"
                  className="text-charcoalBlack text-lg italic font-medium transition-all hover:text-blue-500"
                >
                  Forget Password?
                </a>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-pink-500 ring-pink-300 p-2 rounded-md px-8 mt-8"
                >
                  LOGIN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
