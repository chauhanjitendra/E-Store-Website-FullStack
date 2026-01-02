import { NextResponse } from "next/server"
import { success } from "zod"

export const response = (success, statusCode, message, data)=>{
    return NextResponse.json({
        success, statusCode, message, data
    })
} 


export const catchError = (error,customMeassage)=>{
    //handling duplicate key error
    if(error.code === 11000){
        const keys =object.keys(error.keypattern).join(',')
        error.message = `duplicate fields: ${keys}.these fileds value must be unique`
    }
    let errorObj={}
    
    if(process.env.NODE_ENV === 'development'){
        errorObj={
            message: error.message,
            error
        }
    }else{
        errorObj ={
            message: customMeassage || 'internal server error',
        }
    }
    return NextResponse.json({
        success:false,
        statusCode: error.code,
        ...errorObj,
    })
}

export const generateOTP = ()=>{
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    return otp
}