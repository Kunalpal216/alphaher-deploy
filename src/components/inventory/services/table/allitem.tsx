'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Doctor from '../../../../assets/icons/inventory/doctor.svg';
import Image from 'next/image';
import { Tooltip, Button } from "@nextui-org/react";
import { useAppSelector } from '@/lib/hooks';



interface Services{
  id:string;
  name:string;
  providers:string[];
  category:string;
  serviceCost:number;
  serviceCharge:number;
}



const ServicesAllItem = () => {
  const [services, setServices] = useState<Services[]>([]);
  const appState = useAppSelector((state) => state.app)


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/inventory/service/getAll?branchId=${appState.currentBranchId}`)
    .then(response => response.json())
    .then(data => setServices(data))
    .catch(error => console.error('Error fetching data:', error));
}, []); 
  return (
    <>
    {services.map(service => (
    <div key={service.id} className='flex  w-full  box-border h-16 py-4 bg-white  bg-white border border-solid border-gray-300 text-gray-400 border-t-0.5  hover:bg-gray-200 hover:text-gray-500 transition'>
      <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium'><Link className='transition-colors duration-300 text-gray-400 no-underline hover:underline hover:text-teal-400 ' href='#'>{service.name}</Link></div>
      <div className='w-1/6 flex items-center  px-6  text-neutral-400 text-base font-medium'>  {service?.serviceCost}</div>
      <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium'>{service.serviceCharge}</div>
      <div className='w-2/6 flex items-center px-6 text-neutral-400 text-base font-medium '>
      <div className="relative mr-4">
        <Image src={Doctor} alt='Doctor' className='relative left-0 top-0 w-5 h-5 z-10' />
        <Image src={Doctor} alt='Doctor' className='absolute left-3 top-3 w-5 h-5 z-20' />
      </div>
      <div>
        <div>{service.providers}</div>
      </div>
    </div>
      <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium text-green-500'><span className='bg-green-100 px-1'> <Tooltip content="message" className='bg-black text-white p-1 px-3 text-xs rounded-lg'>

        <Button className='bg-transparent border-none'>{service.category}</Button>
      </Tooltip></span>

      </div>
    </div>

  ))}
  </>
  );
}

export default ServicesAllItem;