"use client";
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import closeicon from "../../../../assets/icons/inventory/closeIcon.svg";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useAppSelector } from '@/lib/hooks';
import Arrow from "../../../../assets/icons/inventory/arrow.svg"

type PopupProps = {
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
    const [lastStep, setLastStep] = useState(false);
    const [formData, setFormData] = useState<any>({});
  const appState = useAppSelector((state) => state.app)
  const [buttonDisabled, setButtonDisabled] = useState(false);
    const [Providers,setProviders] = useState([]);
    const [LinkProducts,setLinkProducts] = useState([]);

const gstOptions = [
    { value: 0, label: 'GST@0%.' },
    { value: 5, label: 'GST@5%.' },
    { value: 12, label: 'GST@12%.' },
    { value: 18, label: 'GST@18%.' },
    { value: 28, label: 'GST@28%.' },
];

const categoryOptions = [
    {value: "General Consultation", label: "General Consultation"},
    {value: "Follow Up", label: "Follow Up"},
    {value: "Surgery", label: "Surgery"},
    {value: "Vaccination", label: "Vaccination"},
    {value: "Grooming", label: "Grooming"},
    {value: "Boarding", label: "Boarding"},
    {value: "Rescue", label: "Rescue"},
]

    useEffect(() => {
        fetchProductsAndProviders();
    },[]);


    const handleContinueClick = () => {
        setLastStep(true);
    }

    const fetchProductsAndProviders = async () => {
        console.log("inside fetch");
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/branch/products?branchId=${appState.currentBranchId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let productsJson = await productsResponse.json();
        console.log(productsJson);
        const staffResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/branch/staff?branchId=${appState.currentBranchId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let staffJson = await staffResponse.json();
        console.log(staffJson);
        setLinkProducts(productsJson.products.map((product) => {return {label : product.itemName,value : product.id}}));
        setProviders(staffJson.staff.map((user) => {return {label : user.name,value : user.id}}));
    }


    const handleSaveClick = async () => {
        try {
            setButtonDisabled(true);
            const selectedProviders = formData.providers.map((provider:any) => provider.value);
            const selectedProducts = formData.linkProducts.map((linkProducts:any) => linkProducts.value);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/inventory/service/create?branchId=${appState.currentBranchId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    providers: selectedProviders,
                    sellingPrice: parseInt(formData.sellingPrice),
                    sacCode: formData.sacCode,
                    linkProducts:selectedProducts,
                    serviceCost: parseInt(formData.serviceCost),
                    serviceCharge: parseInt(formData.serviceCharge),
                    tax: formData.tax ? formData.tax.value : undefined,
                    category: formData.category ? formData.category.value : undefined,
                    description: formData.description,
                  
                }),
            });

            if (response.ok) {
                console.log('Data saved successfully');
                onClose(); 
            } else {
                console.error('Failed to save data:', response.statusText);
            }
        } catch (error) {
            console.error('Error while saving data:', error);
        }
    }

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return <>
        {!lastStep &&
            <div className="w-full h-full flex justify-center items-center  fixed top-0 left-0 inset-0 backdrop-blur-sm bg-gray-200 bg-opacity-50 z-50">
                <div className=" min-h-[500px] px-8 bg-gray-100 rounded-[20px] shadow border border-neutral-400 border-opacity-60 backdrop-blur-[60px] flex-col justify-start items-start gap-6 flex">
                    <div className="self-end items-start gap-6 flex py-2">
                        <button onClick={onClose} className="border-0 outline-none cursor-pointer">
                            <Image src={closeicon} alt="close"></Image>
                        </button>
                    </div>
                    <div className="text-gray-500 text-xl font-medium ">New Service</div>
                    <div className="text-neutral-400 text-base font-medium ">Introduce a new Service</div>
                    <div className="flex items-center gap-[88px]">
                        <div className="text-gray-500 text-base font-medium ">Name*</div>
                        <div>
                            <input className="w-[440px] h-9 text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-[#A2A3A3] rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="name" onChange={(e) => handleChange("name", e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex items-center gap-[61px]">
                        <div className="text-gray-500 text-base font-medium ">SAC Code</div>
                        <div>
                            <input className="w-[440px] h-9 text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-[#A2A3A3] rounded-[5px] focus:border focus:border-[#35BEB1]" type="text" name="sacCode" onChange={(e) => handleChange("sacCode", e.target.value)}/>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="text-gray-500 text-base font-medium ">Description</div>
                        <textarea className="px-2 py-2 w-[576px] h-[88px] mt-[8px]  text-neutral-400 text-base font-medium focus:outline-none border border-solid border-[#A2A3A3] rounded-[5px] focus:border focus:border-[#35BEB1]" id="description" name="description" placeholder="Provide details of the service" onChange={(e) => handleChange("description", e.target.value)} />

                        {/* <input className="w-[576px] h-[88px] mt-[8px]" placeholder="Provide details of the service" type="text" name="description" onChange={(e) => handleChange("description", e.target.value)} /> */}
                    </div>
                    <div className="self-end items-start gap-4 flex">
                        <button onClick={handleContinueClick} className="px-4 py-2.5 bg-bg-zinc-900 rounded-[5px] justify-start items-center gap-1 flex border-0 outline-none cursor-pointer">
                            <div className="text-white text-base font-bold ">Continue</div>
                            <div className="w-6 h-6">
                                <Image src={Arrow} alt="Arrow" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        }
        {lastStep &&
            <div className="w-full h-full flex justify-center items-center  fixed top-0 left-0 inset-0 backdrop-blur-sm bg-gray-200 bg-opacity-50 z-50">
                <div className="w-[640px] h-[543px]  p-8 bg-gray-100 rounded-[20px] shadow border border-neutral-400 border-opacity-60 backdrop-blur-[60px] flex-col justify-start items-start gap-6 flex">
                    
                        <button className="self-end items-center gap-6 flex border-0 rounded outline-none cursor-pointer hover:shadow transition" onClick={onClose}>
                            <Image src={closeicon} alt="close"></Image>
                        </button>
                    
                    <div className="text-gray-500 text-xl font-medium ">New Service</div>
                    <div className="text-neutral-400 text-base font-medium ">Configure your service</div>
                    <div className="flex justify-between items-center  w-full">
                        <div className="flex gap-[35px] items-center">
                            <div className="text-gray-500 text-base font-medium ">Service Charge</div>
                            
                                <input className="w-[157px] h-9 text-neutral-400 text-base font-medium  px-2 focus:outline-none border border-solid border-[#A2A3A3] rounded-[5px] focus:border focus:border-[#35BEB1]" type="number" name="serviceCharge" onChange={(e) => handleChange("serviceCharge", e.target.value)}/>
                            
                        </div>
                        <div className="flex items-center gap-[16px]">
                            <div className="text-gray-500 text-base font-medium ">Tax</div>
                            
                                <Select
                                    className="w-[157px] text-neutral-400 text-base font-medium focus:outline-none  rounded-[5px] focus:border focus:border-[#35BEB1]"
                                    // defaultValue={gstOptions[0]}
                                    isClearable={false}
                                    isSearchable={true}
                                    options={gstOptions}
                                    name="tax"
                            onChange={(value) => handleChange("tax", value)}
                                />
                            
                        </div>
                    </div>
                    <div className="flex items-center gap-[79px] w-full ">
                        <div className="text-gray-500 text-base font-medium ">Category</div>
                        <div className="w-full">
                            {/* <Select
                                className="w-[157px] text-neutral-400 text-base font-medium focus:outline-none border border-solid border-[#A2A3A3] rounded-[5px] focus:border focus:border-[#35BEB1]"
                                placeholder="Select Cate.."
                                isClearable={false}
                                isSearchable={true}
                                options={gstOptions}
                                name="category"
                            onChange={(value) => handleChange("category", value)}
                            /> */}
                            <CreatableSelect 
                            className="w-full text-neutral-400 text-base font-medium focus:outline-none  rounded-[5px] focus:border focus:border-[#35BEB1]"
                            isMulti
                            options={categoryOptions} 
                            onChange={(value) => handleChange("category", value)}/>
                        </div>
                    </div>
                    <div className="flex items-center gap-[75px] w-full">
                        <div className="text-gray-500 text-base font-medium ">Providers</div>
                        <div className="w-4/5">
                            <Select
                                className=" text-neutral-400 text-base font-medium focus:outline-none  rounded-[5px] focus:border focus:border-[#35BEB1] w-full"
                                placeholder="Select clinic staff"
                                isClearable={false}
                                isSearchable={true}
                                options={Providers}
                                isMulti={true}
                                name="providers"
                            onChange={(value) => handleChange("providers", value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-[22px] w-full ">
                        <div className="text-gray-500 text-base font-medium w-[8rem]">Link Product(s)</div>
                        <div className="w-4/5">
                            <Select
                                className="text-neutral-400 text-base font-medium focus:outline-none  rounded-[5px] focus:border focus:border-[#35BEB1] w-full"
                                isClearable={false}
                                isSearchable={true}
                                options={LinkProducts}
                                isMulti={true}
                                name="linkProducts"
                            onChange={(value) => handleChange("linkProducts", value)}
                            />
                        </div>
                    </div>
                    <div className="self-end items-start gap-6 flex">
                        <button onClick={handleSaveClick} disabled={buttonDisabled} className="px-4 py-2.5 bg-zinc-900 rounded-[5px] justify-start items-center gap-2 flex border-0 outline-0 cursor-pointer hover:shadow transition">
                            <div className="text-white text-base font-bold ">Save</div>
                        </button>
                    </div>
                </div>
            </div>
        }
    </>
}

export default Popup;
