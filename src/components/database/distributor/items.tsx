"use client";
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Distributors from '@/app/database/distributor/page';
import { useAppSelector } from '@/lib/hooks';
import { Spinner} from '@nextui-org/react';
import useSWR from 'swr';
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())
interface Distributors{
    id:string,
    distributorName:string,
    contact:string,
    gstinNo:string,
    email:string,

}

const DatabaseDistributorTableItem = () => {
    const [distributors,setDistributor]=useState<Distributors[]>([]);
    const appState = useAppSelector((state) => state.app)
    const {data,error,isLoading}=useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/database/distributors/getAll?branchId=${appState.currentBranchId}`,fetcher,{ revalidateOnFocus : true});
    useEffect(() => {
        const handleWindowFocus = () => {
          console.log('Window focused');
        };
        window.addEventListener('focus', handleWindowFocus);
        return () => window.removeEventListener('focus', handleWindowFocus);
      }, []);
    useEffect(()=>{
     if(!isLoading&&!error&&data){
        setDistributor(data);
     }
    },[data]);
    return (
<>{ distributors.map(distributor=>(
    <div key={distributor.id} className='flex justify-evenly w-full  box-border h-16 py-4 bg-white  bg-white border border-solid border-gray-300 text-gray-400 border-t-0.5  '>
    <div className='w-1/6 flex items-center  px-6  text-neutral-400 text-base font-medium'><Link className='transition-colors duration-300 text-gray-400 no-underline hover:underline hover:text-teal-400 ' href='#'>{distributor.distributorName}</Link></div>
    <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium'>{distributor.contact}</div>
    <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium'>{distributor.gstinNo}</div>
    <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium'>{distributor.email}</div>
    <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium text-green-500'><span className='bg-green-100 px-1'>rfer</span> </div>

</div>
))
    
}
        

  </>  )
}

export default DatabaseDistributorTableItem