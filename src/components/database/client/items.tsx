'use client';
import React, { useEffect, useState } from 'react';
import formatDateAndTime from '@/utils/formateDateTime';
import { useAppSelector } from '@/lib/hooks';
import { Spinner} from '@nextui-org/react';
import useSWR from 'swr';
import Loading from '@/app/loading';
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())

interface Clients {
    id: number;
    clientName: string;
    email: string;
    contact: string;
    address: string;
    city: string;
    pinCode: string;
    patients:Patients[]|undefined;
}

interface Patients{
    id:string;
    patientName:string;
    species:string;
    breed:string;
}

const DatabaseClientTableItem = () => {
    const [clients, setClients] = useState<Clients[]>([]);
    const appState = useAppSelector((state) => state.app)
    const {data,error,isLoading}=useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/database/clients/getAll?branchId=${appState.currentBranchId}`,fetcher, { revalidateOnFocus : true});
    useEffect(() => {
        const handleWindowFocus = () => {
          console.log('Window focused');
        };
        window.addEventListener('focus', handleWindowFocus);
        return () => window.removeEventListener('focus', handleWindowFocus);
      }, []);
    useEffect(()=>{
        if(!isLoading&&data&&!error){
            setClients(data);
        }
    },[data]);
   

    if(isLoading)return (<Loading/>)
    return (
        <>
            {clients?.map(client => (
                
                <div key={client.id} className='flex justify-evenly w-full box-border h-16 py-4 bg-white border border-solid border-gray-300 text-gray-400 border-t-0.5'>
                    <div className='w-1/6 flex items-center px-6 text-neutral-400 text-base font-medium'>{client.clientName}</div>
                    <div className='w-1/6 flex items-center px-6 text-neutral-400 text-base font-medium'>
                        {client.patients && client.patients.map(patient => (
                            <span key={patient.id}>{patient.patientName}</span>
                        ))}
                    </div>

                    <div className='w-1/6 flex items-center px-6 text-neutral-400 text-base font-medium'>{client.contact}</div>
                    <div className='w-1/6 flex items-center px-6 text-neutral-400 text-base font-medium'>{client.email}</div>
                    <div className='w-1/6 flex items-center px-6 text-neutral-400 text-base font-medium'>{client.city}</div>
                </div>
            ))}
        </>
    );
};

export default DatabaseClientTableItem;
