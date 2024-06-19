"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FinancesIcon from './icons/financesIcon';
import notification from '../../assets/icons/navbar/notification.svg';
import alphaherd from '../../assets/icons/navbar/alphaherdLogo.svg';
import PatientlistIcon from './icons/patientlistIcon';
import InventoryIcon from './icons/inventoryIcon';
import HomeIcon from './icons/homeIcon';
import ProfileIcon from "../../assets/icons/settings/pfpcion.jpeg";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import NotificationList from '../home/NotificationCard/NotificationList';
import DropdownMenu from './dropDownMenu/dropDownMenu';
import DropdownIcon from './icons/dropdownIcon';
import { updateApp } from '@/lib/features/appSlice';
import { RootState } from '@/lib/store';
import { useDispatch, useSelector } from 'react-redux';
import { isAdminOfOrg, isManagerOfBranch } from '@/utils/stateChecks';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import zIndex from '@mui/material/styles/zIndex';
import useSWR from "swr";
import { boolean } from 'zod';
//@ts-ignore
const fetcher = (...args:any[]) => fetch(...args).then(res => res.json())
const Navbar = () => {
  const router = useRouter() as any;
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch=useDispatch();
  const user = useAppSelector((state) => state.user);
  const appState = useAppSelector((state) => state.app);

  const handleClick = () => {
    setIsCardOpen(!isCardOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const currentRoute = usePathname();
  const [newNotificationIndicator, setNewNotificationIndicator] = useState<boolean>(false);
  const [notifs,setNotifs]=useState<any[]>([]);
  const {data,error,isLoading}=useSWR(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/notifications/getAll?orgId=${appState.currentOrgId}`,fetcher,{refreshInterval:60000,revalidateOnFocus:true})
  useEffect(() => {
   if (!isLoading && !error && data) {
     setNotifs(data.allNotifs);
     const hasNewNotifications = data.newNotifs?.length > 0;
     setNewNotificationIndicator(hasNewNotifications);
   }
 }, [data]); 
 if (user.name === "" || currentRoute.startsWith("/auth"))return null;

  return (
    <div className='h-16 shadow-md min-w-screen box-border flex items-center justify-between text-textGrey1 bg-navBar z-100'>
      <div className='flex flex-row'>
        <Link className='no-underline py-5 px-10 border-0 border-r-2 border-solid border-gray-800' href={`/`}>
          <div className={currentRoute === "/" ? " text-white text-base font-medium leading-6 flex items-center justify-center" : " text-gray-400 text-base font-medium leading-6 flex items-center justify-center"}>
            <HomeIcon fill={currentRoute === "/" ? "#38F8E6" : "#A2A3A3"} />
            <div className="ml-1">Home</div>
          </div>
        </Link>
        <Link className='no-underline py-5 px-10 border-0 border-r-2 border-solid border-gray-800' href={`/finance/overview`}>
          <div className={currentRoute.startsWith("/finance") ? " text-white text-base font-medium leading-6 flex items-center justify-center" : " text-gray-400 text-base font-medium leading-6 flex items-center justify-center"}>
            <FinancesIcon fill={currentRoute.startsWith("/finance") ? "#38F8E6" : "#A2A3A3"} />
            <div className="ml-1">Finances</div>
          </div>
        </Link>
        <Link className='no-underline py-5 px-10 border-0 border-r-2 border-solid border-gray-800' href={`/inventory/products/all`}>
          <div className={currentRoute.startsWith("/inventory") ? " text-white text-base font-medium leading-6 flex items-center justify-center" : " text-gray-400 text-base font-medium leading-6 flex items-center justify-center"}>
            <InventoryIcon fill={currentRoute.startsWith("/inventory") ? "#38F8E6" : "#A2A3A3"} />
            <div className="ml-1">Inventory</div>
          </div>
        </Link>
        <Link className='no-underline py-5 px-10 border-0 border-r-2 border-solid border-gray-800' href={`/database/clients`}>
          <div className={currentRoute.startsWith("/database") ? " text-white text-base font-medium leading-6 flex items-center justify-center" : " text-gray-400 text-base font-medium leading-6 flex items-center justify-center"}>
            <PatientlistIcon fill={currentRoute.startsWith("/database") ? "#38F8E6" : "#A2A3A3"} />
            <div className="ml-1">Database</div>
          </div>
        </Link>
      </div>
      <div className='flex flex-row h-full'>
        <div className="h-full flex items-center pr-8 border-0 border-r-2 border-solid border-gray-800">
            <Popover placement="bottom-end" showArrow offset={0}>
              <PopoverTrigger>
            <div
              className='py-2 px-4 bg- border-none text-white rounded cursor-pointer transition-all flex items-center'
              onClick={toggleDropdown}
            >
              {appState.currentOrg.orgName}/{appState.currentBranch.branchName}
              <DropdownIcon fill="#fff"/>
            </div>
            </PopoverTrigger>
            <PopoverContent>
            <DropdownMenu/>

            </PopoverContent>
            </Popover>
            {/* {isDropdownOpen && (
            )} */}
          <Link className='no-underline flex pl-6' href='#'>
          <div className="flex items-center justify-center" onClick={handleClick}>
            <div className="relative rounded-full ">  {/* Container styles */}
            {newNotificationIndicator && (  
        <svg width="20" height="20" viewBox="0 0 10 8" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <circle cx="7" cy="1" r="2" fill="red" />
        </svg>
      )}
      <Image src={notification} alt="notification" className="w-full h-full object-cover" />
            </div>
          </div>

          </Link>
          <Link className='no-underline flex pl-6' href='/profile'>
            <div className='text-sm flex items-center justify-center rounded-full overflow-hidden border border-solid border-gray-300'>
              <Image className='w-7 h-7 relative rounded-full border border-neutral-400' src={ProfileIcon} alt='patient' />
            </div>
          </Link>
        </div>
        <Link className='no-underline p-4 flex items-center justify-center h-full' href='/settings/organisation/myorg'>
          <div className='text-sm flex items-center justify-center rounded-full'>
            <Image src={alphaherd} alt='alphaherd' className='w-7 h-7' />
          </div>
        </Link>
        {isCardOpen && (
  <div className="absolute top-[4rem] flex flex-col right-[5rem] w-[443px] max-h-[35rem] pt-6 pb-5 bg-zinc-800 shadow justify-center items-start gap-[5px] rounded-[20px] z-[100]">
    <div className="text-gray-100 text-xl font-medium font-['Roboto'] px-6">
      Notifications
    </div>
    <div className="notification-list-container overflow-auto h-[calc(50rem - 8.5rem)]"> {/* Adjust height as needed */}
      <NotificationList  notifs={notifs} isLoading={isLoading}  />
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default Navbar;
