"use client"
import Image from "next/image"
import { useAppDispatch, useAppSelector, useAppStore } from '@/lib/hooks';
// import hosimage from "../../assets/icons/loginsignup/hos.png";
import { useState } from "react";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"
import { updateUser, UserState } from "@/lib/features/userSlice";
import placeicon from "../../../assets/icons/loginsignup/Placeholder logo.png"

import eyeicon from "../../../assets/icons/loginsignup/1. Icons-24 (4).svg"
import eyeicon1 from "../../../assets/icons/loginsignup/1. Icons-24 (5).svg"
import { AppState, updateApp } from "@/lib/features/appSlice";
import { fetchBranchDetailsById, isAdminOfOrg, isManagerOfBranch } from "@/utils/stateChecks";

const Login = () => {
  const dispatch = useAppDispatch();

  let router = useRouter();

  const queryParams = new URLSearchParams(window.location.search);

  let userInviteString = queryParams.get('userInviteString');

  let [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (event: any) => {

    console.log(data, event.target.value);

    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value
    });
  };

  async function userDetailsLoginSubmit() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/auth/login${userInviteString ? "?userInviteString=" + userInviteString : ""}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
      }
    )
    console.log(res);
    let json = await res.json();
    console.log(json)
    if (!res.ok) {
      throw new Error(json.message);
    }
    dispatch(updateUser(json.user as UserState));
    return json.user;
  }

  const formSubmit = async () => {

    console.log("form button")

    try {

      const user = await userDetailsLoginSubmit();
      const currentBranchUserRole = user.userRoles[0];
      const currentBranch = await fetchBranchDetailsById(currentBranchUserRole.orgBranchId);
      const currentOrgId = currentBranch.orgId;
      const currentBranchId = currentBranch.id;
      const isCurrentOrgAdmin = isAdminOfOrg(currentOrgId,user as UserState);
      const isCurrentBranchManager = isManagerOfBranch(currentBranchId,user as UserState);

      console.log(currentBranchUserRole);
      console.log(currentBranch);
      console.log(currentOrgId);
      console.log(currentBranchId);
      console.log(isCurrentOrgAdmin);
      console.log(isCurrentBranchManager);

      //   const initialState : AppState = {
      //     currentOrgId : null,
      //     currentBranchId : null,
      //     currentOrg : null,
      //     isCurrentOrgAdmin: false,
      //     isCurrentBranchManager: false
      // }

      const appState : AppState = {
        currentOrgId,
        currentBranchId,
        currentBranch,
        currentOrg : currentBranch.org,
        isCurrentOrgAdmin,
        isCurrentBranchManager
      };

      dispatch(updateApp(appState));

      toast.success("Logged in successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      router.push("/");
    }
    catch (err: any) {
      toast.error(err.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <>
      <ToastContainer />
      <div className="w-full h-full flex justify-center items-center bg-white rounded-[20px]">
        <div className="flex items-center w-[1016px] h-full relative bg-white bg-opacity-50 rounded-[30px] border border-stone-300 backdrop-blur-[190.90px]">
          <Image src={placeicon} alt="img" className="w-full h-full" />
          <div className="h-full pr-[84px] pl-[63px] bg-white bg-opacity-50 rounded-[30px] items-start flex flex-col">
            <div className="w-[328px] mt-[146px] text-neutral-500 text-[28px] font-bold ">
              Sign in to continue
            </div>
            <div className="flex flex-col items-start mt-[52px]">
              <div className="w-[120px] text-gray-500 text-base font-medium ">Email*</div>
              <input className="w-[353px] h-11 text-textGrey2 text-base font-medium  px-2 focus:outline-none border border-solid border-[#A2A3A3] rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="email" onChange={handleChange}></input>
            </div>
            <div className="flex flex-col items-start mt-[16px]">
              <div className="w-[120px] text-gray-500 text-base font-medium ">Password*</div>
              <div className="relative">
                <input
                  className="w-[353px] h-11 text-textGrey2 text-base font-medium  px-2 focus:outline-none border border-solid border-[#A2A3A3] rounded-[5px] focus:border focus:border-[#35BEB1]"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                />
                {showPassword ? (<Image
                  src={eyeicon1}
                  alt="Toggle Password Visibility"
                  className="absolute top-[50%] right-3 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />) : (
                  <Image
                    src={eyeicon}
                    alt="Toggle Password Visibility"
                    className="absolute top-[50%] right-3 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility} />)}
              </div>
            </div>
            <div className="flex items-center mt-[16px] gap-2">
              <input type="checkbox" />
              <div className="text-gray-500 text-base font-medium ">Stay signed in</div>
            </div>
            <button className="w-[69px] h-[42px] px-4 py-2 bg-[#35BEB1] hover:bg-teal-500 transition-all rounded-[5px] justify-start items-center gap-2 flex text-white text-sm font-bold  mt-[24px] border-0 outline-none hover:cursor-pointer hover:shadow-md" onClick={formSubmit}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>


  )
}

export default Login;