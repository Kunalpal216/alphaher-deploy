'use client';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks';
import { Spinner} from '@nextui-org/react';
import useSWR from 'swr';
import Loading from '@/app/loading';
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())
interface Clients {
    id: number;
    clientName: string;
}

interface Patients {
    id: number;
    patientName: string;
    clientId: number;
    species: string;
    breed: string;
    age: number;
    gender: string;
}
function useClientFetch (id: number | null) {
    const {data,error,isLoading}=useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/database/clients/getAll?branchId=${id}`,fetcher, { revalidateOnFocus : true});
   return {
    fetchedClients:data,
    isClientLoading:isLoading,
    isClientError:error
   }
}
function usePatientFetch (id: number | null) {
    const {data,error,isLoading}=useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/database/patients/getAll?branchId=${id}`,fetcher, { revalidateOnFocus :true});
   return {
    fetchedPatients:data,
    isPatientLoading:isLoading,
    isPatientError:error
   }
}
const DatabasePatientTableItem = () => {
    const [patients, setPatients] = useState<Patients[]>([]);
    const [clients, setClients] = useState<{ [key: string]: string }>({});
    const appState = useAppSelector((state) => state.app)
    const {fetchedClients,isClientError,isClientLoading}= useClientFetch(appState.currentBranchId);
    const {fetchedPatients,isPatientError,isPatientLoading}= usePatientFetch(appState.currentBranchId);
    useEffect(() => {
        const handleWindowFocus = () => {
          console.log('Window focused');
        };
        window.addEventListener('focus', handleWindowFocus);
        return () => window.removeEventListener('focus', handleWindowFocus);
      }, []);
    
    
    useEffect(() => {
        if(!isPatientError&&!isPatientLoading&&fetchedPatients){
            setPatients(fetchedPatients);
        }

        if(!isClientLoading&&fetchedClients&&!isClientLoading){
            const clientNames = fetchedClients.reduce((acc: { [key: string]: string }, client: Clients) => {
                acc[client.id] = client.clientName;
                return acc;
            }, {});
            setClients(clientNames);
        }
                
            
    }, [fetchedClients,fetchedPatients]);
if(isPatientLoading)return (<Loading/>)
    return (
        <>
            {patients?.map(patient => (
                <div key={patient.id} className='flex justify-evenly w-full  box-border h-16 py-4 bg-white  bg-white border border-solid border-gray-300 text-gray-400 border-t-0.5  '>
                    <div className='w-1/6 flex items-center  px-6  text-neutral-400 text-base font-medium'>
                        <Link className='transition-colors duration-300 text-gray-400 no-underline hover:underline hover:text-teal-400 ' href='#'>
                            {patient.patientName}
                        </Link>
                    </div>
                    <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium'>
                        {clients[patient.clientId] || "Loading..."}
                    </div>
                    <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium'>
                        {patient.species} & {patient.breed}
                    </div>
                    <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium'>
                        {patient.age}
                    </div>
                    <div className='w-1/6 flex  items-center  px-6 text-neutral-400 text-base font-medium'>
                        {patient.gender}
                    </div>
                </div>
            ))}
        </>
    );
}

export default DatabasePatientTableItem;
