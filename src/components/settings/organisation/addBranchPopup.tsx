"use client";
import Image from "next/image";
import React, { useState } from 'react';
import { Tooltip, Button } from "@nextui-org/react";
import Link from 'next/link';
import closeicon from "../../../assets/icons/inventory/closeIcon.svg";
import { useAppSelector } from "@/lib/hooks";
import { Bounce, ToastContainer, toast } from 'react-toastify';

const AddBranchPopup = ({ onClose }) => {

    const appState = useAppSelector((state) => state.app);

    const [branchNameInput, setBranchNameInput] = useState<string>('');

    const handleInputChange = (event: any) => {
        setBranchNameInput(event.target.value);
    };

    const handleAddBranch = async () => {
        try{
            if (branchNameInput.trim() !== '') {
                let resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/auth/admin/branch?orgId=${appState.currentOrgId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        "branchName": branchNameInput.trim()
                    })
                });
                let json = await resp.json();
                if(!resp.ok){
                    console.log(json);
                    throw new Error(json.message);
                }
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
                setTimeout(() => onClose(),4000)
            }
        }
        catch(err : any){
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
    };

    return <>
    <ToastContainer />
        <div className="w-full h-full flex justify-center items-center  top-0 left-0 fixed inset-0 backdrop-blur-sm bg-gray-200 bg-opacity-50 z-50">
            <div className="w-[640px] p-8 bg-gray-100 rounded-[20px] shadow border border-neutral-400/opacity-60 backdrop-blur-[60px] flex-col justify-start items-start gap-6 inline-flex">
                <div className="self-stretch justify-start items-start gap-6 inline-flex">
                    <div className="w-[528px] h-6 relative rounded-[5px]" />
                    <div className="w-6 h-6 relative bg-gray-200 rounded-[5px]" >
                        <Button onClick={onClose} className="outline-none border-0 hover:cursor-pointer">
                            <Image src={closeicon} alt="image" />
                        </Button>
                    </div>
                </div>
                <div className="flex-col justify-start items-start gap-2 flex">
                    <div className="text-gray-500 text-xl  ">Add Branch to your Organisation</div>
                    <div className="text-neutral-400 text-base  ">Enter name for the new branch</div>
                </div>
                <div className="self-stretch h-[147px] flex-col justify-start items-start gap-4 flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                        <div className="grow shrink basis-0 h-11 py-[13px] bg-white rounded-[5px] border border-neutral-400 justify-start items-center gap-4 flex">
                            <input type="text" name="" id="" className="text-neutral-400 text-base  h-11 px-4 py-[13px] w-[100%] bg-white rounded-[5px] border border-neutral-400 justify-start items-center gap-4 flex" placeholder="Enter Branch" value={branchNameInput}
                                onChange={handleInputChange} />
                        </div>
                        <div className="w-[132px] self-stretch px-4 py-2.5 bg-zinc-900 rounded-[5px] justify-start items-center gap-2 flex" onClick={handleAddBranch}>
                            <div className="text-white text-base hover:cursor-pointer">Add Branch</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default AddBranchPopup;


