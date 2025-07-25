import { NextResponse } from "next/server";
import { UserModel } from "@/lib/models/User";
import {dbConnect} from "@lib/mongodb"


export async function POST(req: Request){
    const {email, password} = req.json();

    await dbConnect();

    const user = await UserModel.findOne({
        email, password
    }).populate("employeeId");

    if (!user){
        return NextResponse.json(
            {
                message: "Invalid Credentials"
            },
            {
                status:401
            }
        );
    }

    return NextResponse.json(
        {
            user:{
                role:user.role,
                email:user.email,
                employee:user.employeeId // full employee info
            }
        }
    )




}