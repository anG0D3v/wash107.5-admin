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
      <div className="flex justify-center items-center px-6 h-screen relative">
        <div className='relative'>
        <img
          className="w-42 h-34 object-cover hidden md:flex md:basis-1/2 absolute -left-64 -bottom-20 -z-10"
          src={jeepLogo}
          alt=""
        />
        <img
          className="w-46 h-34 object-cover hidden md:flex md:basis-1/2 absolute -right-72 -bottom-20 -z-10"
          src={jeepLogo}
          alt=""
        />
        <div className=" px-8 py-10 sm:pt-12 pb-20 rounded-xl bg-gray-800 shadow-lg outline-none z-10 ">

          <div className="md:basis-1/2 sm:w-[500px] relative flex justify-center items-center flex-col">
            <img
              className="w-32 absolute left- -top-24 border-8 border-solid border-white rounded-full"
              src={laundryLogo}
              alt=""
            />
              <h1 className="text-4xl text-white font-bold mt-12">
                Welcome!
              </h1>
              <p className="text-white text-lg italic font-medium mb-6">
                Login to continue
              </p>
            <form
              onSubmit={handleSumbmit}
              className="block space-y-5 w-full mb-5"
              action=""
            >

              <div className="space-y-8 w-full">
                <div>
                <input
                  className="mt-2 w-full placeholder:text-lg placeholder:italic text-black placeholder:font-light block bg-white w-4/5 border border-vividOrange rounded py-4 px-5 shadow-sm focus:outline-none focus:border-vividOrange focus:ring-vividOrange focus:ring-1 sm:text-sm"
                  type="email"
                  placeholder="Email"
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                />
                </div>
                <div>
                  <div className="relative mt-2 shadow-sm">
                  <input
                  className="text-black w-full mt-2 placeholder:text-lg placeholder:italic placeholder:text-charcoalBlack placeholder:font-light block bg-white w-4/5 border border-vividOrange rounded py-4 px-5 shadow-sm focus:outline-none focus:border-vividOrange focus:ring-vividOrange focus:ring-1 sm:text-sm mb-4"
                  type={isSeePassword ? 'text' : 'password'}
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
                  className="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3"
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
                  </div>
                </div>
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

      </div>
    </>
  );
}
