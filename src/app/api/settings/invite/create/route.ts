import { NextResponse, NextRequest } from 'next/server'
import { decrypt, encrypt } from '../../../../../../auth';
import prismaClient from '../../../../../../prisma';
import { connectToDB } from '@/utils';
import { UserState } from '@/lib/features/userSlice';
import nodemailer from 'nodemailer';

function htmlTemplate(userInviteString : String){

    let inviteLink = process.env.NEXT_PUBLIC_API_BASE_PATH || process.env.CUSTOMCONNSTR_NEXT_PUBLIC_API_BASE_PATH + "/api/settings/invite?userInviteString=" + userInviteString;

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Invitation</title>
        <style>
            /* Add your custom styles here */
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
    
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
            }
    
            .btn:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <h2>Invitation to Join Our Platform</h2>
            <p>Hello,</p>
            <p>You have been invited to join our platform. Click the button below to accept the invitation:</p>
            <p><a href=${inviteLink} class="btn">Accept Invitation</a></p>
            <p>If you are unable to click the button above, you can also copy and paste the following link into your browser:</p>
            <a href=${inviteLink}>${inviteLink}</a>
            <p>We look forward to seeing you!</p>
            <p>Best regards,<br>Your Team</p>
        </div>
    </body>
    
    </html>
    `;
}

export const POST = async (req: NextRequest) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    console.log("inside API")

    const { branchId, role, email} = await req.json();

    const requestHeaders = new Headers(req.headers)

    let userId = Number(requestHeaders.get("userId"));

    console.log(userId);

    let orgBranch = await prismaClient.orgBranch.findUnique({
        where: {
            id: branchId
        }
    });

    console.log(orgBranch);

    let adminUser = await prismaClient.user.findUnique({
        where: {
            id: userId
        },
        include: {
            adminOrganizations: {}
        }
    });

    if (!adminUser) {
        return new Response(JSON.stringify({"message" : "Not Admin"}), { status: 400 });
    }

    let isAdmin = (adminUser.adminOrganizations.length === 0 ? false : (adminUser.adminOrganizations.find(e => e.id === orgBranch?.orgId)))

    if (!isAdmin && !orgBranch) {
        return new Response(JSON.stringify({"message" : "Not admin of org"}), { status: 400 });
    }

    let invitedUser = await prismaClient.user.findUnique({
        where: {
            email : email
        }
    });

    if(invitedUser){
        const orgBranchUserRole = await prismaClient.orgBranchUserRole.findFirst({
            where: {
                userId: invitedUser?.id,
                orgBranchId: branchId
            }
        });
    
        console.log(orgBranchUserRole)
    
        if(orgBranchUserRole){
            return new Response(JSON.stringify({ "message": "User is already part of the branch" }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

    }

    let userInviteString = await encrypt({ branchId, role, email }, "7 day");

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.AUTOMATED_GMAIL || process.env.CUSTOMCONNSTR_AUTOMATED_GMAIL,
            pass: process.env.AUTOMATED_GMAIL_APP_PASSWORD || process.env.CUSTOMCONNSTR_AUTOMATED_GMAIL_APP_PASSWORD,
        },
    });

    const message = "Hi there, you were emailed me through nodemailer"
    const options = {
        from: process.env.AUTOMATED_GMAIL || process.env.CUSTOMCONNSTR_AUTOMATED_GMAIL, // sender address
        to: email, // receiver email
        subject: "Invitation to join Organization: Alphaherd", // Subject line
        text: message,
        html: htmlTemplate(userInviteString),
    }

    transporter.sendMail(options, (error, info)=> {
        if (error) {
            console.error(error);
        } else {
            console.info('Email sent: ' + info.response);
        }
    });

    return new Response(JSON.stringify({"message" : "success"}),{status: 200});

}