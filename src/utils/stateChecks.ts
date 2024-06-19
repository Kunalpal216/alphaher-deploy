import { UserState } from "@/lib/features/userSlice";
import { useAppSelector } from "@/lib/hooks";

export function isAdminOfOrg(orgId : Number,user : UserState){
    return user.adminOrganizations.some((org : any) => org.id===orgId)
}

export function isManagerOfBranch(branchId : Number,user : UserState){
    return user.userRoles.some((org : any) => {
        if(org.id===branchId){
            return org.role==="Manager";
        }
        return false;
    });
}

export const fetchBranchDetailsById = async (branchId: Number) => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH}/api/details/branch`);
    url.searchParams.append('branchId', String(branchId));
    const resp = await fetch(url, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
    });
    if(resp.ok){
        return await resp.json();
    }
    else{
        throw new Error("Something went wrong");
    }
}
