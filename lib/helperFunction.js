// // import { jwtVerify } from "jose";
// // import { encode } from "jose/dist/types/util/base64url";
// // import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export const response = (success, statusCode, message, data) => {
//   return NextResponse.json({
//     success,
//     statusCode,
//     message,
//     data,
//   });
// };

// export const catchError = (error, customMeassage) => {
//   //handling duplicate key error
//   if (error.code === 11000) {
//     const keys = object.keys(error.keypattern).join(",");
//     error.message = `duplicate fields: ${keys}.these fileds value must be unique`;
//   }
//   let errorObj = {};

//   if (process.env.NODE_ENV === "development") {
//     errorObj = {
//       message: error.message,
//       error,
//     };
//   } else {
//     errorObj = {
//       message: customMeassage || "internal server error",
//     };
//   }
//   return NextResponse.json({
//     success: false,
//     statusCode: error.code,
//     ...errorObj,
//   });
// };

// export const generateOTP = () => {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   return otp;
// };



// export const isAuthenticated = async (role) => {
//   try {
//     const cookieStore = await cookies();
//     if (!cookieStore.has("access_token")) {
//       return {
//         isAuth: false,
//       };
//     }
//     const access_token = cookieStore.get("access_token");
//     const { payload } = await jwtVerify(access_token.value, new TextEncoder());
//     encode(process.env.SECRET_KEY);

//     if (payload.role !== role) {
//       return {
//         isAuth: false,
//       };
//     }
//     return {
//       isAuth: true,
//       userId: payload._id,
//     };
//   } catch (error) {
//     catchError(error);
//     return {
//       isAuth: false,
//       error
//     };
//   }
// };


import { NextResponse } from "next/server";

export const response = (success, statusCode, message, data) => {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data,
  });
};

export const catchError = (error, customMessage) => {
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern).join(", ");
    error.message = `Duplicate fields: ${keys}. These fields must be unique.`;
  }

  const errorObj =
    process.env.NODE_ENV === "development"
      ? { message: error.message, error }
      : { message: customMessage || "Internal Server Error" };

  return NextResponse.json({
    success: false,
    statusCode: error.code || 500,
    ...errorObj,
  });
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const columnConfig = (column,isCreatedAt = false, isUpdateAt = false, isDeletedAt = false) =>{
  const newColumn = [...column]

  if(isCreatedAt){
    newColumn.push({
      accessorKey: 'isCreatedAt',
      header: 'Created At',
      Cell:({renderedCellValue})=>(new Date(renderedCellValue).toLocaleDateString())
    })
  }
  if(isUpdateAt){
    newColumn.push({
      accessorKey: 'updatedAt',
      header: 'Updated At',
      Cell:({renderedCellValue})=>(new Date(renderedCellValue).toLocaleDateString())
    })
  }
  if(isDeletedAt){
    newColumn.push({
      accessorKey: 'deletedAt',
      header: 'Deleted At',
      Cell:({renderedCellValue})=>(new Date(renderedCellValue).toLocaleDateString())
    })
  }

  return newColumn  
}