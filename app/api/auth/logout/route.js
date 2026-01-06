import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST(request){
    try {
        connectDB()
        const cookieStore = await cookies()
        cookieStore.delete('access_token')
        return response(true,200, 'LogOut Successfull')
    } catch (error) {
        catchError(error)
    }
}