'use client';
import React, { useState, useEffect } from 'react';
import { Tooltip, Button } from "@nextui-org/react";
import Link from 'next/link';
import formatDateAndTime from '@/utils/formateDateTime';
import { Inventory } from '@prisma/client';
import { useAppSelector } from '@/lib/hooks';
interface AllServices {
    id: number;
    name: string;
    providers: string[];
    category: string;
    serviceCost: number;
    serviceCharge: number;
}

interface InventoryTimeline {
    id: number;
    stockChange: string;
    invoiceType: string;
    quantityChange: number;
    party: string;
    service: AllServices;
    createdAt: string;
}

const ServicesTimelineItem = () => {
    const [services, setServices] = useState<InventoryTimeline[]>([]);
    const appState = useAppSelector((state) => state.app)

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/inventory/getAll?branchId=${appState.currentBranchId}`)
            .then(response => response.json())
            .then(data => setServices(data.filter((inventory: { inventoryType: any; }) => inventory.inventoryType===Inventory.Service)))
            .catch(error => console.error('Error fetching services:', error));
    }, []);

  

    return (
        <>
            {services.map(inventory => (
                <div className='flex w-full box-border h-16 py-4 bg-white border border-solid border-gray-300 text-gray-400 border-t-0.5 hover:bg-gray-200 hover:text-gray-500 transition' key={inventory.id}>
                    <div className='w-1/12 flex items-center px-6 text-neutral-400 text-base font-medium'>{formatDateAndTime(inventory.createdAt).formattedDate}</div>
                    <div className='w-1/12 flex items-center px-6 text-neutral-400 text-base font-medium'>{formatDateAndTime(inventory.createdAt).formattedTime}</div>
            <div className='w-2/12 flex items-center  px-6  text-neutral-400 text-base font-medium'><Link className='transition-colors duration-300 text-gray-400 no-underline hover:underline hover:text-teal-400 ' href='#'>{inventory.service?.name}</Link>  </div>
            <div className='w-1/12 flex  items-center  px-6 text-neutral-400 text-base font-medium text-red-500'>{inventory.quantityChange}</div>
            <div className='w-2/12 flex  items-center  px-6 text-neutral-400 text-base font-medium'>{inventory.party}</div>
            <div className='w-2/12 flex  items-center  px-6 text-neutral-400 text-base font-medium'>{inventory.service?.serviceCost}</div>
    
            <div className='w-2/12 flex  items-center  px-6 text-neutral-400 text-base font-medium text-gray-500'><span className='bg-gray-200 px-1'> <Tooltip content="message" className='bg-black text-white p-1 px-3 text-xs rounded-lg'>

                <Button className='bg-transparent border-none'>{inventory.invoiceType}</Button>
            </Tooltip></span>
            
        
            </div>
            <div className='w-1/12 flex items-center  px-6  text-neutral-400 text-base font-medium'><Link className='transition-colors duration-300 text-gray-400 no-underline hover:underline hover:text-teal-400 ' href='#'>SI-23141</Link>  </div>
        </div>

    ))}
    </>
    )
}

export default ServicesTimelineItem;