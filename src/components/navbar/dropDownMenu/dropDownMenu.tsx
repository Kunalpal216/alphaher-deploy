"use client";
import { updateApp } from '@/lib/features/appSlice';
import { UserState } from '@/lib/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { isAdminOfOrg, isManagerOfBranch } from '@/utils/stateChecks';
import React, { useEffect, useState } from 'react';

const DropdownMenu = () => {

  const [selectedOrg,setSelectedOrg] = useState(null);

  const [orgAndBranchMapping, setOrgAndBranchMapping] = useState([]);

  const [secondLevelItems, setSecondLevelItems] = useState([]);

  const appState = useAppSelector((state) => state.app);

  const user = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  async function fetchOrgAndBranchMapping() {
    let resp = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/navbar/dropdown?branchId=${appState.currentBranchId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (resp.ok) {
      let body = await resp.json();
      console.log(body)
      setOrgAndBranchMapping(body);
    }
  }

  function handleOrgBranchSelect(orgBranch : any){

    console.log(orgBranch);

    const isCurrentOrgAdmin = isAdminOfOrg((selectedOrg as any).id,user as UserState);
    const isCurrentBranchManager = isManagerOfBranch(orgBranch.id,user as UserState);

    dispatch(updateApp({
      currentBranch : orgBranch,
      currentBranchId : orgBranch.id,
      currentOrg : selectedOrg,
      currentOrgId : (selectedOrg as any).id,
      isCurrentBranchManager : isCurrentBranchManager,
      isCurrentOrgAdmin : isCurrentOrgAdmin
    }));

    window.location.reload();

  }

  useEffect(() => {
    fetchOrgAndBranchMapping()
  }, []);


  return (
      <div className="w-48 h-[4rem] bg-zinc-900 rounded-lg shadow-lg">
        {
          orgAndBranchMapping.map((mapping: any, index) => {
            return (
              <div key={index} onClick={() => {
                setSecondLevelItems(mapping.allowedBranches);
                let org = mapping;
                delete org.allowedBranches;
                setSelectedOrg(org);
              }} className="px-4 py-1 text-white font-bold text-lg hover:bg-[#262626ad]  hover:cursor-pointer focus:outline-none border-l-0 border-r-0 border-t-0 border-b border-solid border-borderGrey">
                {mapping.orgName}
              </div>
            )
          })
        }
        {
          secondLevelItems.map((orgBranch: any, index) => {
            return (
              <div key={index} className="w-48 bg-zinc-900 rounded-lg shadow-lg px-4 py-2 text-white cursor-pointer" onClick={() => handleOrgBranchSelect(orgBranch)}>
                {orgBranch.branchName}
              </div>
            )
            
          })
        }
      </div>
  );
};


export default DropdownMenu;


