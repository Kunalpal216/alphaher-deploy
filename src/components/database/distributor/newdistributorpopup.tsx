"use client";
import Image from "next/image";
import React, { useState } from 'react';
import { Tooltip, Button } from "@nextui-org/react";
import Link from 'next/link';
import closeicon from "../../../assets/icons/inventory/closeIcon.svg";
import arrowicon from "../../../assets/icons/inventory/arrow.svg";
import Select from 'react-select';
import Attachment from "../../../assets/icons/finance/attachment.svg"
import Check from "../../../assets/icons/database/check.svg"
import { useAppSelector } from "@/lib/hooks";


type PopupProps = {
    onClose: () => void;
}


const Popup: React.FC<PopupProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<any>({});
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)
    
    const appState = useAppSelector((state) => state.app)


    const handleSaveClick = async () => {
        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/database/distributors/create?branchId=${appState.currentBranchId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    distributorName: formData.name,
                    email: formData.email,
                    contact: formData.contact,
                    gstinNo: formData.gstinNo,
                    panNo: formData.panNo,
                    address:formData.address,
                    city:formData.city.value,
                    pinCode:formData.pinCode,
                }),
            });
            if (response.ok) {
                console.log('Data saved successfully');
                onClose();
                window.dispatchEvent(new FocusEvent('focus'));
            } else {
                console.error('Failed to save data:', response.statusText);
            }
        } catch (error) {
            console.error('Error while saving data:', error);
        } finally {
            
        }
    };
    

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
        if (field === "name" && value.trim() !== "") {
            setIsSaveDisabled(false);
        } else if (field === "name" && value.trim() === "") {
            setIsSaveDisabled(true);
        }
    };

    const gstOptions = [
        {}
    ];

    const City = [
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Mumbai', label: 'Mumbai' },
        {value:'Chennai', label:'Chennai'},
        {value:'Bangalore', label:'Bangalore'},
        {value:'Gurgaon', label:'Gurgaon'}
]

    return <>

       <div className="w-full h-full flex justify-center items-center  fixed top-0 left-0  inset-0 backdrop-blur-sm bg-gray-200 bg-opacity-50 z-50">
            <div className="w-[640px] h-[705px]  px-8 py-4 bg-gray-100 rounded-[20px] shadow border border-neutral-400 border-opacity-60 backdrop-blur-[60px] flex-col justify-start items-start gap-6 flex">
                <div className="self-end items-start gap-6 flex">
                    <button className="border-0 outline-none cursor-pointer" onClick={onClose}>
                        <Image src={closeicon} alt="close"></Image>
                    </button>
                </div>
                <div className="text-gray-500 text-xl font-medium ">Add Distributor</div>
                <div className="text-neutral-400 text-base font-medium ">New distributor? Enter their details to get started.</div>
                <div className="flex items-center gap-[88px]">
                    <div className="text-gray-500 text-base font-medium ">Name*</div>
                    <div>
                    <input className="w-[447px] h-9 text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-borderGrey rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="name" onChange={(e) => handleChange("name", e.target.value)} />
                    </div>
                </div>
              
                <div className="flex items-center gap-[96px]">
                    <div className="text-gray-500 text-base font-medium ">Email</div>
                    <div>
                    <input className="w-[447px] h-9 text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-borderGrey rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="email" onChange={(e) => handleChange("email", e.target.value)} />
                    </div>
                </div>
                <div className="flex items-center gap-[45px]  w-[581px]">
                    <div className="text-gray-500 text-base font-medium  w-2/12">Mobile No.*</div>
                    <div className="flex w-10/12 items-center">
                    <div className="flex gap-0 bg-white w-full items-center h-9">
                    
                        <Select
                            className="text-neutral-400 text-base font-medium h-9 w-[8rem]"
                            placeholder="+91"
                            isClearable={false}
                            isSearchable={true}
                            options={gstOptions}
                            name="providers"
                            onChange={(value) => handleChange("providers", value)}
                        />
                    
                    <div className="w-full h-full">
                        <input className="h-full w-full text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-borderGrey rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="contact" onChange={(e) => handleChange("contact", e.target.value)} />
                    </div>
                    </div>
                    <div className=" ml-1  w-10 h-9 ">
                    <button  className="w-full h-full rounded-[5px] justify-center text-2xl items-center gap-2 flex border border-borderGrey border-solid bg-white outline-none">
                        <div className="text-textGrey1 text-lg">+</div>
                    </button>
                    </div>
                    </div>
                </div>
                <div className="flex items-center gap-[85px]">
                    <div className="text-gray-500 text-base font-medium ">GSTIN </div>
      
                    <input className="w-[447px] h-9 text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-borderGrey rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="gstinNo" onChange={(e) => handleChange("gstinNo", e.target.value)} />
                  
                    <div className="h-6 px-2 py-1.5 bg-teal-400 rounded-[5px] justify-center items-center gap-2 inline-flex absolute right-12">
<div className="text-white text-sm font-medium ">Fetch Details</div>
</div>  
                </div>
                <div className="flex items-center gap-1">
                    <div className="text-gray-500 text-base font-medium w-[8.2rem]">PAN Number</div>
                    <div>
                    <input className="w-[447px] h-9 text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-borderGrey rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="panNo" onChange={(e) => handleChange("panNo", e.target.value)} />
                    </div>
                </div>
                <div className="flex items-center gap-[45px] w-[581px]">
                    <div className="text-gray-500 text-base font-medium  w-2/12">Address</div>
                    <div className="flex w-10/12">
                  
                    <div className="flex-1">
                        <input className="w-[447px] h-9 text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-borderGrey rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="address" onChange={(e) => handleChange("address", e.target.value)} />
                    </div>
                    {/* <div className=" ml-1  w-9 h-9 ">
                    <button  className="w-full h-full rounded-[5px] justify-center text-2xl items-center gap-2 flex border-borderGrey border border-solid bg-white outline-none">
                        <div className="text-neutral-400 text-lg">+</div>
                    </button>
                    </div> */}
                    </div>
                </div>
                <div className="flex gap-[14px] justify-between  w-[584px]">

                
                <div className="flex items-center gap-[104px] w-[22rem]">
                    <div className="text-gray-500 text-base font-medium  w-2/12">City</div>
                    <div className="flex w-10/12  h-11">
             
                        <Select
                            className="text-neutral-400 w-[10rem] text-base font-medium "
                            placeholder=""
                            isClearable={false}
                            isSearchable={true}     
                            options={City}
                            isMulti={true}
                            name="city"
                            onChange={(value) => handleChange("city", value)}
                        />
         
              
                 
            
                    </div>
                </div>
                <div className="flex items-center w-[22rem] justify-end">
                    <div className="text-gray-500 text-base font-medium  w-[5rem]">Pin Code</div>
                    <div className="flex  h-9">
           
                   
                        <input className=" w-[7.5rem] ml-[25px] h-9 text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-borderGrey rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="pinCode" onChange={(e) => handleChange("pinCode", e.target.value)} />
            
                   
                    </div>
                </div>
            </div>
             
                <div className=" justify-between items-start gap-6 flex w-full">
                <div className=" h-11 px-6 py-2.5 rounded-[5px]  justify-center items-center inline-flex border border-borderGrey border-dashed ">
                        <div className="self-stretch justify-start items-center gap-2 inline-flex">
                            <div className="w-6 h-6 flex justify-center items-center"> <Image src={Attachment} alt='Attachment' className='w-6 h-6 ' /></div>
                            <div className="justify-start items-center gap-4 flex">
                                <div className="text-gray-500 text-base font-bold ">Upload Catalouge</div>
                            </div>
                        </div>
                    </div>
                    <div className="h-11 px-4 py-2.5 bg-zinc-900 rounded-[5px] justify-start items-center gap-2 flex cursor-pointer"  onClick={handleSaveClick} >
    <div className="w-6 h-6 relative">
        <div className="w-6 h-6 left-0 top-0 absolute" >
            <Image src={Check} alt="Check" />
        </div>
    </div>
    <div className="text-gray-100 text-base font-bold ">Save</div>
</div>
                  
                </div>
            </div>
        </div>
      
     
    </>;
}

export default Popup;


