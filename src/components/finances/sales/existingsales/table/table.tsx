"use client"
import Download from '../../../../../assets/icons/finance/download.svg';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import ExistingsalesHeader from "./header"
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
import ExistingsalesBottomBar from './bottombar';
import ExistingsalesTotalAmout from './totalamount';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import useSWR from 'swr';
import formatDateAndTime from '@/utils/formateDateTime';
//@ts-ignore
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())

const ExistingsalesTable = () => {
    const url = useSearchParams();
    const id = url.get('id');
    const appState = useAppSelector((state) => state.app);
    const [otherData, setOtherData] = useState({});
    
      
    
        const initialItems: any[] | (() => any[])=[];
        const [items, setItems] = useState(initialItems);
    
        const {data,error,isLoading} =useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/finance/sales/${id}/?branchId=${appState.currentBranchId}`,fetcher)
        
        
        useEffect(() => {
            if (!isLoading && data && !error) {
                
                const {items,...otherData}=data;
                setOtherData(otherData)
                console.log(items)
              const shallowDataCopy = [...items]; 
              const itemData = shallowDataCopy.map((item: any) => ({
                id: item.productBatch.productId,
                itemName:item.name,
                quantity:item.quantity,
                sellingPrice:item.sellingPrice,
                expiry:item.productBatch.expiry,
                batchNumber:item.productBatch.batchNumber,
                tax:item.taxAmount,
                discount:item.discount
              }));
              setItems(itemData);
            }
          }, [data]); 
          
    console.log(items)
    const batchOptions = [
        { value: 'one', label: 'one' },
        { value: 'two', label: 'two' },
        { value: 'three', label: 'three' }
    ];

    const taxOptions = [
        { value: 'Tax excl.', label: 'Tax excl.' },
        { value: 'Tax incl.', label: 'Tax incl.' }
    ];

    const gstOptions = [
        { value: 'GST@18%.', label: 'GST@18%.' },
        { value: 'GST@9%.', label: 'GST@9%.' }
    ];

    const colourOptions = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]


    const Checkbox = ({ children, ...props }: JSX.IntrinsicElements['input']) => (
        <label style={{ marginRight: '1em' }}>
            <input type="checkbox" {...props} />
            {children}
        </label>
    );


    const [disableButton, setDisableButton] = useState(true);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isChecked, setChecked] = useState(false);






    useEffect(() => {
        if (!disableButton && inputRef.current) {
            inputRef.current.focus();
        }
    }, [disableButton]);

 
   

    return (
        <>
            <div className="w-full h-full flex-col justify-start items-start flex mt-2 bg-gray-100 rounded-lg border border-solid border-borderGrey">
            <div className="w-full h-[84px] p-6 bg-white rounded-tl-[10px] rounded-tr-[10px] border-b border-t-0 border-r-0 border-l-0 border-solid border-borderGrey justify-start items-center gap-6 flex">
                <div className='bg-green-200 rounded-md px-2' ><span className="text-green-600  text-sm font-medium ">You’re owed: ₹</span><span className="text-green-600 text-sm font-bold ">2,124</span></div>
                <div className='flex items-center justify-center border w-7 h-7 border-solid border-gray-300 border-0.5 rounded-md p-1'><Image src={Download} alt='Download' className='w-4  h-4' /></div>
                </div>
                <div className="flex-col w-full pr-[16px] pl-[16px] pt-[20px]">
                    <ExistingsalesHeader otherData={otherData}/>

                    <div className="w-full rounded-md border border-solid border-borderGrey">
                    <div className="w-full h-[84px] p-6 bg-white rounded-t-md  justify-between items-center gap-6 flex border-t-0 border-r-0 border-l-0 border-b border-solid border-borderGrey">
                    <div className="text-gray-500 text-xl font-medium ">
                                Items
                            </div>

                        </div>
                        <div>
                        <div className='flex w-full justify-evenly items-center box-border bg-gray-100 h-12  text-gray-500 border-t-0 border-r-0 border-l-0 border-b border-solid border-borderGrey'>
                                <div className=' flex text-gray-500 text-base font-medium w-[3rem]'>No.</div>
                                <div className=' flex text-gray-500 text-base font-medium w-[15rem]'>Name</div>
                                <div className=' flex text-gray-500 text-base font-medium w-[10rem]'>Batch No.</div>

                                <div className='flex text-gray-500 text-base font-medium  w-1/12'>Quantity</div>
                                <div className=' flex text-gray-500 text-base font-medium w-[10rem]'>Selling Price</div>


                                <div className=' flex text-gray-500 text-base font-medium  w-1/12'>Tax %</div>
                                <div className=' flex text-gray-500 text-base font-medium  w-[10rem]'>Tax Amt.</div>
                                <div className=' flex text-gray-500 text-base font-medium  w-1/12'>Total</div>
                            </div>
                            {items.map((item,index) => (
                                <div key={item.id} className="flex flex-col">
                                     <div  className='flex justify-evenly items-center w-full  box-border  bg-white  border-t-0 border-r-0 border-l-0 border-b border-solid border-borderGrey text-gray-400   '>
                                    <div className='w-[3rem] flex items-center text-[#6B7E7D] text-base font-medium'>{index+1}</div>
                                    <div className='w-[15rem] flex items-center text-[#6B7E7D] text-base font-medium'>{item.itemName}</div>
                                    <div className='w-[10rem] flex-col items-center text-[#6B7E7D] text-base font-medium'>
                                    <div className="text-[#6B7E7D] text-base  font-medium  "> {item.batchNumber}</div>

                                        <div className="text-neutral-400 text-[10px] font-medium ">{formatDateAndTime(item.expiry).formattedDate}</div>
                                    </div>
                                    <div className='w-1/12 flex items-center text-[#6B7E7D] text-base font-medium gap-[12px]'>
                                      
                                      <div>{item.quantity}</div>
                                    
                                  </div>
              
                                    <div className='w-[10rem] flex items-center text-neutral-400 text-base font-medium gap-5'>
                                        <div className=" flex items-center text-[#6B7E7D] text-base font-medium">{item.sellingPrice}</div>
                                        <div className="text-neutral-400 text-[12px]  font-medium  "> Tax inc</div>

                                    </div>
                                   
                                 
                                    <div className='w-1/12 flex items-center text-[#6B7E7D]text-base font-medium'>
                                    <div className="text-[#6B7E7D] text-base  font-medium  "> {item.tax}</div>

                                    </div>
                                    <div className='w-[10rem] flex items-center text-[#6B7E7D] text-base font-medium'>{`₹${item.quantity * item.tax}`}</div>
                                    <div className='w-1/12 flex items-center text-[#6B7E7D] text-base font-medium'>{`₹${item.quantity * item.sellingPrice +item.quantity* item.tax}`}</div>
                                   
                                </div>
                                    <div>
                                    <div className='flex  w-full justify-evenly items-center box-border bg-white  h-12  border-t-0 border-r-0 border-l-0 border-b border-solid border-borderGrey text-gray-500'>
                                        <div className=' flex text-gray-500 text-base font-medium w-[3rem]'></div>
                                        <div className=' flex text-gray-500 text-base font-medium w-[15rem]'>
                                            <div className=" h-7 px-2 py-1.5 bg-violet-100 rounded-[5px] justify-center items-center gap-2 inline-flex">
                                                <div className="text-indigo-600 text-sm font-medium ">Item Discount</div>
                                            </div>
                                        </div>
                                        <div className=' flex text-gray-500 text-base font-medium w-[10rem]'> {item.discount*100}% off</div>
                                        <div className=' flex text-gray-500 text-base font-medium w-1/12'>

                                        </div>

                                        <div className=' flex text-gray-500 text-base font-medium w-[10rem]'></div>

                                        <div className=' flex text-gray-500 text-base font-medium w-1/12'> </div>
                                        <div className=' flex text-gray-500 text-base font-medium w-[10rem]'></div>
                                        <div className="text-red-500 text-base font-bold w-1/12 ">-₹{item.discount*item.sellingPrice*item.quantity}</div>
                                     
                                    </div>

                                    </div>
                                </div>
                                
                               
                            ))}
                            <div className='flex  w-full justify-evenly items-center box-border bg-gray-100  h-12  border-b border-neutral-400 text-gray-500 rounded-b-md'>
                                <div className=' flex text-gray-500 text-base font-medium  w-[3rem]'></div>
                                <div className=' flex text-gray-500 text-base font-medium  w-[15rem]'> Total</div>
                                <div className=' flex text-gray-500 text-base font-medium  w-[10rem]'></div>
                                <div className=' flex text-gray-500 text-base font-medium  w-1/12'>{items.reduce((acc, item) => acc + item.quantity, 0)} Items</div>
                                <div className=' flex text-gray-500 text-base font-medium  w-[10rem]'> </div>
                              
                                
                            
                                <div className=' flex text-gray-500 text-base font-medium  w-1/12'>
                                <div className="text-neutral-400 text-base  font-medium   "></div>
                                </div>
                                <div className=' flex text-gray-500 text-base font-medium  w-[10rem]'>{`₹${items.reduce((acc, item) => acc + item.quantity  * item.tax, 0).toFixed(2)}`}</div>
                                <div className='flex text-gray-500 text-base font-medium w-1/12' >{`₹${(items.reduce((acc, item) => acc + item.quantity * item?.sellingPrice+item.quantity*item?.sellingPrice*item.tax-(item.quantity*item?.sellingPrice*item.discount||0), 0) .toFixed(2) ||0)}`}</div>

                            </div>
                        </div>

                    </div>
                        <ExistingsalesTotalAmout otherData={otherData} />
                </div>
                <ExistingsalesBottomBar existingSalesData={data} />
            </div>



        </>

    )
}

export default ExistingsalesTable;
