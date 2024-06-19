"use client";
import React, { useEffect, useState } from 'react'
import {Tooltip,Button, Spinner} from "@nextui-org/react";
import Menu from '@/assets/icons/finance/Menu.svg';
import Image from 'next/image';
import Link from 'next/link';
import { Popover, PopoverTrigger, PopoverContent, Input } from "@nextui-org/react";
import { productSchema } from '@/schemas/inventory/productValidation';
import { FinanceCreationType } from '@prisma/client';
import { useAppSelector } from '@/lib/hooks';
import formatDateAndTime from '@/utils/formateDateTime';
import useSWR from 'swr';
import { usePathname, useSearchParams } from 'next/navigation';
import Loading from '@/app/loading';
//@ts-ignore
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())
interface Sales {
  id:number;
  date:string;
  type:FinanceCreationType;
  customer:string;
  invoiceNo:number;
  totalCost:number;
  totalQty:number;
  dueDate:string;
  status:string;
}
const FinancesSalesTableItem = ({onCountsChange}:any) => {
    const appState = useAppSelector((state) => state.app);
    const [sales,setSales]=useState<Sales[]>([]);
    const currentUrl=useSearchParams();
    
  const {data,error,isLoading}=useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/finance/sales/getAll?branchId=${appState.currentBranchId}`,fetcher)
  useEffect(()=>{
    const filteredData=data?.filter((sale:any)=>{
      if(currentUrl.get('type')==='all'){
        return true;
      }else {
        return sale.type===currentUrl.get('type');
      }
    })
    
    setSales(filteredData);
  },[data,setSales])

  const [invoiceCount, setInvoiceCount] = useState(0);
  const [estimateCount, setEstimateCount] = useState(0);
  const [returnCount, setReturnCount] = useState(0);
  useEffect(() => {
    if (data) {
      setInvoiceCount(data.filter((sale:any) => sale.type === FinanceCreationType.Sales_Invoice).length);
      setEstimateCount(data.filter((sale:any) => sale.type === FinanceCreationType.Sales_Estimate).length);
      setReturnCount(data.filter((sale:any) => sale.type === FinanceCreationType.Sales_Return).length);
    }
  }, [data]);
 

  const handleCounts = () => {
   
    if (onCountsChange) {
      onCountsChange({
        invoiceCount,
        estimateCount,
        returnCount,
      });
    }
  };
  useEffect(() => {
    handleCounts(); 
  }, [sales]);
 
if(isLoading&&!data)return (<Loading/>)
  return (
     <div>
      {sales?.map(sale=>(
        

    <div key={sale.id} className='flex justify-around items items-center  w-full  box-border h-16 py-4 bg-white  border border-solid border-gray-300 text-gray-400 border-t-0.5  hover:bg-gray-200 hover:text-gray-500 transition'>
    <div className='w-1/12 flex items-center     text-neutral-400 text-base font-medium'>{formatDateAndTime(sale.date).formattedDate}</div>
    <div className='w-1/12 flex  items-center    text-neutral-400 text-base font-medium'>{formatDateAndTime(sale.date).formattedTime}</div>
    <Link
  href={{
    pathname: sale.type === FinanceCreationType.Sales_Estimate ? 'existingsalesestimate' : 
              sale.type === FinanceCreationType.Sales_Invoice ? 'existingsales' : 
              sale.type===FinanceCreationType.Sales_Return?'existingsalesreturn':"",
    query: { id: sale.id}
  }}
><div className='flex w-[4rem]  items-center   text-neutral-400 text-base font-medium'>{sale.type==FinanceCreationType.Sales_Estimate?("Estimate"):(sale.type==FinanceCreationType.Sales_Invoice)?("Invoice"):("Return")}</div></Link> 
    <div className='w-2/12 flex  items-center   text-neutral-400 px-4 text-base font-medium'>{sale.customer}</div>
    <div className='w-1/12 flex  items-center   text-neutral-400 text-base font-medium'>{sale.invoiceNo}</div>
    <div className='w-1/12 flex  items-center   text-neutral-400 text-base font-medium'>$ {(sale.totalCost).toFixed(2)}</div>
    <div className='w-1/12 flex  items-center  text-neutral-400 text-base font-medium'>{sale.totalQty}</div>
    <div className='w-1/12 flex  items-center   text-neutral-400 text-base font-medium'>{formatDateAndTime(sale.dueDate).formattedDate}</div>
    <div className='w-1/12 flex  items-center    text-base font-medium text-green-500'>
      <span className='bg-green-100 px-1'> 
    <Tooltip content={sale.status} className='bg-black text-white p-1 px-3 text-xs rounded-lg'>

 <Button className='bg-transparent border-none'>{sale.status}</Button>
</Tooltip></span>

 </div>
 <div className=' right-16'>
      
      <Popover placement="left" showArrow offset={10}>
          <PopoverTrigger>
              <Button color="gray-400"
                  variant="solid"
                  className="capitalize flex border-none  text-gray rounded-lg ">  
                  <div className='flex items-center '><Image src={Menu} alt='Menu' className='w-5  h-5' /></div></Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 text-gray-500 bg-white text-sm p-2 font-medium flex flex-row items-start rounded-lg border-2 ,t-3 mt-2.5">
    
              <div className="flex flex-col ">
                 
                  <div className='flex flex-col'>
                  
                  <Link className='no-underline flex item-center' href='/finance/overview'>
                  <div className='text-gray-500 text-sm p-3 font-medium flex '>
                  gtr</div>
                  </Link>
                  <Link className='no-underline flex item-center' href='/finance/overview'>
                  <div className='text-gray-500 text-sm p-3 font-medium flex '>
                 grtt</div>
                  </Link>
                  <Link className='no-underline flex item-center' href='/finance/overview'>
                  <div className='text-gray-500 text-sm p-3 font-medium flex '>
                  gtrt</div>
                  </Link>
                
                  </div>
              </div>
            

          </PopoverContent>
      </Popover>



  </div>
</div>
))}

   
</div> )
}

export default FinancesSalesTableItem