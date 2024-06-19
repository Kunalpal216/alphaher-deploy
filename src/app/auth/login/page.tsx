'use client'
import Login from "@/components/auth/login/login";
import initializeScheduling from "@/lib/initializeScheduling";
import axios from "axios";
import { useEffect } from "react";

const LoginPage = () => {
    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/bullScheduler`)
      }, []);
    
    return <div className='flex h-screen flex-col'>

        <div className='w-full h-full flex-1 bg-gray-200 p-4 px-10'>
            <div className="w-full h-full flex-1 flex justify-center items-center  rounded-[20px]">
                <div className="w-[1016px] h-[620px] bg-white bg-opacity-50 rounded-[30px] border border-solid border-stone-300">
                    <Login />
                </div>
            </div>
        </div>
    </div>
}

export default LoginPage;