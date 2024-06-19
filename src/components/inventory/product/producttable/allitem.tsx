'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { Tooltip, Button, Spinner } from "@nextui-org/react";
import { Inventory } from '@prisma/client';
import { reverse } from 'dns';
import formatDateAndTime from '@/utils/formateDateTime';
import InventoryProductTableBottombar from './bottombar'; 
import useSWR from 'swr';
import { useAppSelector } from '@/lib/hooks';
import Loading from '@/app/loading';
//@ts-ignore
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())

interface Products{
  id:string;
  itemName:string;
  hsnCode:string;
}
interface ProductBatch {
  id: number;
  date: string;
  time: string;
  quantity: number;
  batchNumber:string;
  party:string;
  expiry:string;
  distributors:string;
  costPrice:number;
  sellingPrice :number;
  category :string;
  product:Products;

}
interface InventoryTimeline{
  id:string;
  stockChange:string;
  invoiceType:string;
  quantityChange:number;
  party:string;
  productBatch:ProductBatch;
  createdAt:string;

}

const ProductAllItem = () => {
  const [products, setProducts] = useState<InventoryTimeline[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); 
  const appState = useAppSelector((state) => state.app);
  const {data,error,isLoading}= useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/inventory/getAll?branchId=${appState.currentBranchId}`,fetcher)
  useEffect(()=>{
    if(!isLoading&&data&&!error){
      const filteredData = data.filter((inventory: { inventoryType: any; }) => inventory.inventoryType===Inventory.Product)
      setProducts(filteredData);
      console.log('Products Data:', filteredData); 
    }
    
  },[data])
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
 if(isLoading)return (<Loading/>)
  return (
    <>
    <div>
      {currentProducts?.map(inventory => (
      
        <div key={inventory.id} className='flex w-full box-border h-16 py-4 bg-white border border-solid border-gray-300 text-gray-400 border-t-0.5 hover:bg-gray-200 hover:text-gray-500 transition'>
          <div className='w-1/12 flex items-center px-6 text-neutral-400 text-base font-medium'>{formatDateAndTime(inventory.createdAt).formattedDate}</div>
          <div className='w-1/12 flex items-center px-6 text-neutral-400 text-base font-medium'>{formatDateAndTime(inventory.createdAt).formattedTime}</div>
          <div className='w-2/12 flex items-center px-6 text-neutral-400 text-base font-medium'>
            <Link href={{pathname:'overview',query:{id:`${inventory.productBatch?.id}`}}} className='transition-colors duration-300 text-gray-400 no-underline hover:underline hover:text-teal-400'>
              {inventory.productBatch?.product?.itemName}
            </Link>
          </div>
          <div className='w-1/12 flex items-center px-6 text-neutral-400 text-base font-medium'>{inventory.quantityChange}</div>
          <div className='w-1/12 flex items-center px-6 text-neutral-400 text-base font-medium text-green-500'>
            <span className='bg-green-100 px-1'>
              <Tooltip content="message" className='bg-black text-white p-1 px-3 text-xs rounded-lg'>
                <Button className='bg-transparent border-none'>{inventory.stockChange}</Button>
              </Tooltip>
            </span>
          </div>
          <div className='w-1/12 flex  items-center  px-6 text-neutral-400 text-base font-medium flex-col'>
            <div className='text-gray-500 text-xs'>{inventory.productBatch?.batchNumber}</div>
            <div className='text-neutral-400 text-[10px] font-medium'>{formatDateAndTime(inventory.productBatch?.expiry).formattedDate}</div>
          </div>
          <div className='w-2/12 flex  items-center  px-6 text-neutral-400 text-base font-medium'>{inventory.productBatch?.party}</div>
          <div className='w-1/12 flex  items-center justify-center text-gray-500 text-sm font-medium px-2 py-1.5 bg-gray-200 rounded-md'>{inventory.invoiceType}</div>
          <div className='w-2/12 flex  items-center  px-6 text-neutral-400 text-base font-medium'>{inventory.productBatch?.product?.hsnCode}</div>
        </div>
      ))}
       {/* Pagination controls */}
       <InventoryProductTableBottombar
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        paginate={paginate}
      />
      </div>
    </>
  )
}

export default ProductAllItem;


