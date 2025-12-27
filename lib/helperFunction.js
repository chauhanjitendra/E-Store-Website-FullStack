import { NextResponse } from "next/server"

export const response = (sucees, statusCode, message, data)=>{
    return NextResponse.json({
        sucees, statusCode, message, data
    })
} 


export const catchError = (error,customMeassage)=>{
    //handling duplicate key error
    if(error.code === 11000){
        const keys =object.keys(error.keypattern).join(',')
        error.message = `duplicate field: ${keys}.these fileds value must be unique`
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
    return response(false,error.code, ...errorObj)
}