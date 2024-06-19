"use client"
import React, { useState } from 'react'
import continuebutton from "../../../../assets/icons/loginsignup/1. Icons-24.svg"
import Image from "next/image"
import 'react-toastify/dist/ReactToastify.css';
import OrgNameSetup from '@/components/auth/admin/orgNameSetup';
import OrgDetailsSetup from '@/components/auth/admin/orgDetailsSetup';
import OrgAdminSetup from '@/components/auth/admin/orgAdminSetup';
import { useRouter, useSearchParams } from 'next/navigation';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import { z } from 'zod';
import { setValidationErrorsForForm } from '@/utils/setValidationErrorForForm';
import { useAppSelector } from '@/lib/hooks';

const formSchema = z.object({
  orgName: z.string().min(4, 'Org Name must be at least 4 characters'),
  orgEmail: z.string().email('Invalid Email Address'),
  gstNo: z.string().length(15, 'Invalid GST No.'),
  phoneNo: z.string().length(10, 'Invalid Phone No.'),
  address: z.string(),
  state: z.string(),
  pincode: z.string(),
  description: z.string(),
  adminName: z.string(),
  adminEmail: z.string().email('Invalid Email Address'),
  adminPhoneNo: z.string().length(10, 'Invalid Phone No.'),
  adminAltPhoneNo: z.string(),
  adminPassword: z.string().min(4, 'Admin Password must be at least 4 characters'),
  reAdminPassword: z.string().min(4, 'Admin Password must be at least 4 characters')
});

const OrgSetup = () => {

  let router = useRouter();

  var initialData = {
    orgName: '',
    orgEmail: '',
    gstNo: '',
    phoneNo: "",
    branchName: "",
    adminName: '',
    adminEmail: '',
    adminPhoneNo: "",
    adminAltPhoneNo: "",
    address: '',
    state: '',
    pincode: '',
    description: '',
    adminPassword: '',
    reAdminPassword: '',
  }

  var stepFields = [
    ["orgName"],
    ["orgEmail","gstNo","phoneNo","branchName","address","state","pincode","description"],
    ["adminName","adminEmail","adminPhoneNo","adminAltPhoneNo","adminPassword","reAdminPassword"]
  ];

  const [data, setData] = useState(initialData);

  const [validationErrors, setValidationErrors] = useState(data);

  console.log(validationErrors);

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    try{
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      console.log("inside handle change 1");
      formSchema.parse({...data,[name]: value});
      console.log("inside handle change 2");
      setValidationErrors((prevErrors) => {
        console.log("here");
        let newErrors = prevErrors;
        newErrors[name] = '';
        return newErrors;
      });
    }
    catch(err : any){
      if (err instanceof z.ZodError) {
        console.log(err.flatten());
        let fieldErrors = err.flatten().fieldErrors;
        console.log(fieldErrors);
        let fields: string[] = Object.keys(fieldErrors);
        console.log(name);
        console.log(fields);
        if(fields.includes(name)){
          setValidationErrors((prevErrors) => {
            let newErrors = prevErrors;
            newErrors[name] = fieldErrors[name].length > 0 ? fieldErrors[name][0] : '';
            return newErrors;
          });
        }
        else{
          setValidationErrors((prevErrors) => {
            console.log("here");
            let newErrors = prevErrors;
            newErrors[name] = '';
            return newErrors;
          });
        }
      }
    }
  };

  const formSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    console.log("form button")

    try {

      formSchema.parse(data);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/auth/admin/orgRegister`,
        {
          method: 'POST',
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            "orgDetails": {
              "orgEmail": data.orgEmail,
              "orgName": data.orgName,
              "gstNo": data.gstNo,
              "address": data.address,
              "state": data.state,
              "pincode": data.pincode,
              "description": data.description,
              "phoneNo": data.phoneNo
            },
            "adminUserDetails": {
              "name": data.adminName,
              "email": data.adminEmail,
              "password": data.adminPassword,
              "phoneNo": data.adminPhoneNo
            },
            "branchName": data.branchName
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
        router.push(`/auth/login`)
      }
      else {
        throw new Error(json.message);
      }
    }
    catch (err : any) {
      console.log(err.message);
      console.log(typeof(err))
      if (err instanceof z.ZodError) {
        console.log(err.flatten());
        setValidationErrorsForForm(err,setValidationErrors,activeTab,stepFields);
      } else {
        console.error('Error:', err);
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
  }

  function handleContinue(){
    try{
      formSchema.parse(data);
      setActiveTab(prev => prev + 1);
    }
    catch(err : any){
      if (err instanceof z.ZodError) {
        console.log(err.flatten());
        if(!setValidationErrorsForForm(err,setValidationErrors,activeTab,stepFields)){
          setActiveTab(prev => prev + 1);
        }
      }
    }
  }

  const formElements = [
    <OrgNameSetup key="orgName" data={data} handleChange={handleChange} validationErrors={validationErrors} />,
    <OrgDetailsSetup key="orgDetails" data={data} handleChange={handleChange} validationErrors={validationErrors} />,
    <OrgAdminSetup key="orgAdmin" data={data} handleChange={handleChange} validationErrors={validationErrors} />
  ];

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col'>

        <div className='w-full min-h-screen bg-gray-200 p-4 px-10 justify-center items-center flex'>
            <div className="w-[1016px] bg-white bg-opacity-50 rounded-[30px] border border-solid border-stone-300">
              {
                formElements[activeTab]
              }
              <div className="flex justify-between px-[5rem] pb-[2rem]">
                {
                  activeTab!==0 ? <button
                  className=" bg-gray-200 rounded-[5px] justify-start items-center gap-2 flex border-0" disabled={activeTab === 0 ? true : false}
                  onClick={() => setActiveTab(prev => prev - 1)}>
                  <div className="h-[42px] px-4  bg-stone-900 rounded-[5px] justify-start items-center gap-2 flex ">
                    <div className="text-white text-sm font-bold ">
                      Prev
                    </div>
                    <div className="w-6 h-6 relative">
                      <Image src={continuebutton} alt="button" />
                    </div>
                  </div>
                </button> : <div></div>
                }
                {
                  activeTab !== formElements.length - 1 ? <button className=" bg-gray-200 rounded-[5px] justify-start items-center gap-2 flex border-0"
                    disabled={activeTab === formElements.length - 1 ? true : false}
                    onClick={() => handleContinue()} >
                    <div className="h-[42px] px-4  bg-stone-900 rounded-[5px] justify-start items-center gap-2 flex ">
                      <div className="text-white text-sm font-bold ">
                        Continue
                      </div>
                      <div className="w-6 h-6 relative">
                        <Image src={continuebutton} alt="button" />
                      </div>
                    </div>
                  </button> : null
                }
                {
                  activeTab === formElements.length - 1 ? <button className=" bg-gray-200 rounded-[5px] justify-start items-center gap-2 flex border-0" onClick={formSubmit}>
                    <div className="h-[42px] px-4  bg-stone-900 rounded-[5px] justify-start items-center gap-2 flex ">
                      <div className="text-white text-sm font-bold ">
                        Submit Details
                      </div>
                    </div>
                  </button> : null
                }
              </div>
            </div>
          </div>
      </div>
    </>
  )
}

export default OrgSetup
