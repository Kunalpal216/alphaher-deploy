'use client';
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Spinner } from '@nextui-org/react'
import formatDateAndTime from '@/utils/formateDateTime'
import { useAppSelector } from '@/lib/hooks';
import Loading from '@/app/loading';
//@ts-ignore
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())

const FinancesExpensesTableItem = () => {
const [expenses,setExpenses]=useState<any[]>([]);
const appState = useAppSelector((state) => state.app);
  const
  {data,error,isLoading}=useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/finance/expenses/getAll?branchId=${appState.currentBranchId}`,fetcher,{revalidateOnFocus:true});
  useEffect(()=>{
  if(!isLoading&&data&&!error){
  setExpenses(data);
  }
  },[data]);
  if(isLoading)return (<Loading/>)
  return (
  <div>
    {expenses?.map(expense=>
    <div
      className='flex  w-full justify-evenly items-center  box-border h-16 bg-white border border-solid border-gray-300 text-gray-400 border-t-0.5  '>
      <div className='w-[6rem] flex    text-neutral-400 text-base font-medium'>{formatDateAndTime(expense.date).formattedDate}</div>
      <div className='w-[6rem] flex    text-neutral-400 text-base font-medium'>{formatDateAndTime(expense.date).formattedTime}</div>
      <Link href="/finance/expenses/exsistingrecurring">
      <div className='w-[10rem] flex  text-neutral-400 text-base font-medium'>{expense.type}</div>
      </Link>
      <div className='w-2/12 flex    text-neutral-400 text-base font-medium '>{expense.party}</div>
      <div className='w-[9rem] flex    text-neutral-400 text-base font-medium'>{expense.invoiceNo}</div>
      <div className='w-1/12 flex    text-neutral-400 text-base font-medium'>$ {(expense.totalCost).toFixed(2)}</div>
      <div className='w-[9rem] flex    text-neutral-400 text-base font-medium'>{expense.totalQty} items</div>
      <div className='w-[6rem] flex    text-neutral-400 text-base font-medium'>{formatDateAndTime(expense.dueDate).formattedDate}</div>
      <div className='w-[12rem] flex  text-base font-medium text-green-500'><span
          className='bg-green-100 px-1'>{expense.status}</span> </div>

    </div>
    )}
  </div>
  )
  }

  export default FinancesExpensesTableItem