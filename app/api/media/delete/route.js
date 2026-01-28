// import { isAuthenticated } from "@/lib/authServer";
// import cloudinary from "@/lib/cloudinary";
// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import MediaModel from "@/models/Media.Model";
// import mongoose from "mongoose";

// export async function PUT(request){
//     try {
//         const auth =await isAuthenticated('admin')
//         if(!auth.isAuth){
//             return response(false, 403, 'Unauthorized.')
//         }
//         await connectDB()
//         const payload = await request.json()

//         const ids = payload.ids || []
//         const deleteType = payload.deleteType

//         if(!Array.isArray(ids) || ids.length === 0){
//              return response(false, 400, 'Invalid Or Empty ids lists.')
//         }

//         const media = await MediaModel.find({_id: {$in:ids}}).lean()
//         if(!media.length){
//              return response(false, 404, 'Data Note Found.')
//         }

//         if(!['SD','RSD'].includes(deleteType)){
//              return response(false, 400, 'Invalid delete operation.Delete type should be SD or RSD for this route')
//         }

//         if(deleteType === 'SD'){
//             await MediaModel.updateMany({_id: {$in: ids}}, {$set:{deletedAt: new Date().toISOString()}})
//         }else{
//             await MediaModel.updateMany({_id: {$in: ids}}, {$set:{deletedAt: null}})
//         }

//         return response(true,200, deleteType === 'SD' ? 'Data Moved Into trash.' :'Data restored')

//     } catch (error) {
//         return catchError(error)
//     }
// }


// export async function DELETE(request){
//     const session = await mongoose.startSession()
//     session.startTransaction()

//     try {
//         const auth =await isAuthenticated('admin')
//         if(!auth.isAuth){
//             return response(false, 403, 'Unauthorized.')
//         }
//         await connectDB()
//         const payload = await request.json()

//         const ids = payload.ids || []
//         const deleteType = payload.deleteType

//         if(!Array.isArray(ids) || ids.length === 0){
//              return response(false, 400, 'Invalid Or Empty ids lists.')
//         }

//         const media = await MediaModel.find({_id: {$in:ids}}).session(session).lean()
//         if(!media.length){
//              return response(false, 404, 'Data Note Found.')
//         }

//         if(!deleteType === 'PD'){
//              return response(false, 400, 'Invalid delete operation.Delete type should be PD for this route')
//         }

//         await MediaModel.deleteMany({_id: {$in: ids }}).session(session)

//         // delete all media from cloudinary.
//         const publicIds =media.map(m => m.public_id)

//         try {
//             await cloudinary.api.delete_resources(publicIds)
//         } catch (error) {
//             await session.abortTransaction()
//             session.endSession()
//         }   

//         await session.commitTransaction()
//         session.endSession()

//         return response(true,200, 'Data Deleted Permently.')

//     } catch (error) {
//         await session.commitTransaction()
//         session.endSession()
//         return catchError(error)
//     }
// }



import { isAuthenticated } from "@/lib/authServer";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.Model";
import mongoose from "mongoose";

export async function PUT(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 400, "Invalid or empty ids list.");
    }

    const media = await MediaModel.find({ _id: { $in: ids } }).session(session);
    if (!media.length) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 404, "Data not found.");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      await session.abortTransaction();
      session.endSession();
      return response(
        false,
        400,
        "Invalid delete operation. Delete type should be SD or RSD for this route"
      );
    }

    if (deleteType === "SD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } },
        { session }
      );
    } else {
      // RSD → restore
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return response(
      true,
      200,
      deleteType === "SD" ? "Data moved into trash." : "Data restored."
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}

export async function DELETE(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();
    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 400, "Invalid or empty ids list.");
    }

    const media = await MediaModel.find({ _id: { $in: ids } }).session(session);
    if (!media.length) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 404, "Data not found.");
    }

    if (deleteType !== "PD") {
      await session.abortTransaction();
      session.endSession();
      return response(
        false,
        400,
        "Invalid delete operation. Delete type should be PD for this route"
      );
    }

    // Delete from DB
    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

    // Delete from Cloudinary
    const publicIds = media.map((m) => m.public_id);
    try {
      if (publicIds.length) {
        await cloudinary.api.delete_resources(publicIds);
      }
    } catch (cloudErr) {
      console.error("Cloudinary delete error:", cloudErr);
      // Optional: ignore Cloudinary errors, DB transaction will still commit
    }

    await session.commitTransaction();
    session.endSession();
    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}
