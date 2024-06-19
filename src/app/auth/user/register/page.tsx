"use client"
import { UserAccountSetup } from "@/components/auth/user/userLogin";
import React, { useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrgNameSetup from '@/components/auth/admin/orgNameSetup';
import OrgDetailsSetup from '@/components/auth/admin/orgDetailsSetup';
import OrgAdminSetup from '@/components/auth/admin/orgAdminSetup';
import { useRouter } from 'next/navigation';

export default function UserAccountSetupPage() {

    let router = useRouter();

    const queryParams = new URLSearchParams(window.location.search);

    let userInviteString = queryParams.get('userInviteString');

    const [data, setData] = useState({
        name: "",
        email: "",
        phoneNo: "",
        altPhoneNo: "",
        password: "",
        rePassword: ""
    });

    const handleChange = (event: any) => {

        console.log(data, event.target.value);

        const { name, value } = event.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    const formSubmit = async () => {

        console.log("form button")

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/auth/user/register${userInviteString ? "?userInviteString="+userInviteString : ""}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        phoneNo: data.phoneNo,
                        altPhoneNo: data.altPhoneNo,
                        password: data.password
                    })
                }
            )
            console.log(res);
            let json = await res.json();
            if (res.ok) {
                toast.success(json.message, {
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
                router.push(`/auth/login`);
            }
            else {
                throw new Error(json.message);
            }
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


    return <>
        <div className='flex flex-col'>

            <div className='w-full min-h-screen bg-gray-200 p-4 px-10 justify-center items-center flex'>
                <div className="w-[1016px] bg-white bg-opacity-50 rounded-[30px] border border-solid border-stone-300">
                    <UserAccountSetup data={data} handleChange={handleChange} />
                    <div className="w-[936px] mx-auto flex justify-end mb-[2rem]">
                    <button className=" bg-gray-200 rounded-[5px] gap-2 flex border-0 cursor-pointer hover:shadow-lg"
                        onClick={() => formSubmit()}>
                        <div className="h-[42px] px-4  bg-stone-900 rounded-[5px] justify-start items-center gap-2 flex ">
                            <div className="text-white text-sm font-bold">
                                Submit Details
                            </div>
                        </div>
                    </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}