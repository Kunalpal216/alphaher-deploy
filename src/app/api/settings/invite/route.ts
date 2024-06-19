import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../../../../../auth";
import prismaClient from '../../../../../prisma';
import { redirect } from 'next/navigation'
import { create } from "domain";

export const GET = async (req: NextRequest, res: NextResponse) => {

    // redirect method throws an error so it should be called outside the try catch block

    let redirectURL = process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH;

    console.log(req.method);

    try {
        if (req.method !== 'GET') {
            return new Response('Method not allowed', { status: 405 });
        }

        console.log("Inside settings/invite");

        const { searchParams } = new URL(req.url!);
        const userInviteString = searchParams.get("userInviteString");

        if (!userInviteString) {
            return new NextResponse(JSON.stringify({ "message": "No Invite String Found" }), { status: 200 });
        }

        console.log("User invite string found");

        const { branchId, role, email } = await decrypt(userInviteString);

        console.log(branchId, role, email);

        const user = await prismaClient.user.findUnique({
            where: {
                email
            }
        });

        const orgBranch = await prismaClient.orgBranch.findUnique({
            where: {
                id: branchId
            }
        });

        console.log(user)

        if (!user) {
            console.log("here")
            redirectURL+=`/auth/user/register?userInviteString=${userInviteString}`;
        }
        else{
            redirectURL+=`/auth/login?userInviteString=${userInviteString}`
            // await prismaClient.orgBranchUserRole.create({
            //     data: {
            //         orgBranchId: Number(orgBranch?.orgId),
            //         userId: user!.id,
            //         role: role
            //     }
            // });
        }
    }
    catch (error : any) {
        console.log(error);
        console.log(typeof (error))
        return new Response(JSON.stringify({ "message": error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    finally{
        console.log(redirectURL);
        redirect(redirectURL)
    }
}