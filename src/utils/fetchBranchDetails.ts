import { NextRequest } from 'next/server';
import prismaClient from '../../prisma';

export const fetchBranchDetailsById = async (branchId: Number) => {
    console.log("Here's the branch id",branchId)
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/details/branch`);
    url.searchParams.append('branchId', String(branchId));
    console.log("Here's the url",url)
    const resp = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });
    if(resp.ok){
        return (await resp.json());
    }
    else{ 
        console.error(Error)
        throw new Error("Something went wrong");
    }
}

export const fetchInventoryId = async (request:NextRequest) => {
    const url = request.nextUrl;
    const { searchParams } = new URL(url);
    console.log(searchParams);
    const branchId = searchParams.get("branchId")!;  
    
    console.log("here's the final branchID",branchId)
    if (!branchId) {
        throw new Error("Branch ID not found in request");
    }
    const orgBranch=await prismaClient.orgBranch.findUnique({
        where: {
            id : Number(branchId)
        }
    });
    console.log(orgBranch)
    const inventorySection = await prismaClient.inventorySection.findUnique({
        where: {
            branchId: Number(branchId),
        }
    });
    if (!inventorySection && orgBranch) {
        console.log("here");
        await prismaClient.inventorySection.create({
            data: {
                name: "Inventory-" + orgBranch.branchName,
                quantity: 1,
                branchId: Number(branchId)
            }
        })
    }

    return inventorySection?.id;
}


export const fetchFinanceId = async (request:NextRequest) => {
    const url = request.nextUrl;
    const { searchParams } = new URL(url);
    console.log(searchParams);
    const branchId = searchParams.get("branchId")!;  
    
    console.log("here's the final branchID",branchId)
    if (!branchId) {
        throw new Error("Branch ID not found in request");
    }
    const orgBranch=await fetchBranchDetailsById(Number(branchId));
    console.log(orgBranch)

    const financeSection = await prismaClient.financeSection.findUnique({
        where: {
            branchId: Number(branchId)
        }
    });
    if (!financeSection && orgBranch) {
        await prismaClient.financeSection.create({
            data: {
                name: "Finance-" + orgBranch.branchName,
                branchId: Number(branchId),
                amount:1
            }
        })
    }

    return financeSection?.id;
}

export const fetchDatabaseId = async (request:NextRequest) => {
    const url = request.nextUrl;
    const { searchParams } = new URL(url);
    console.log(searchParams);
    const branchId = searchParams.get("branchId")!;  
    
    console.log("here's the final branchID",branchId)
    if (!branchId) {
        throw new Error("Branch ID not found in request");
    }
    const orgBranch=await fetchBranchDetailsById(Number(branchId));
    console.log(orgBranch)
    const databaseSection = await prismaClient.databaseSection.findUnique({
        where: {
            branchId: Number(branchId)
        }
    });
    if(!databaseSection&&orgBranch){
        await prismaClient.databaseSection.create({
            data: {
                name: "Database-" + orgBranch.branchName,
                branchId: Number(branchId),
               type:"type1"
            }
        })
    }

    return databaseSection?.id;
}