
import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import userModel from "@/models/UserModel";
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

    const data = await userModel.find({ _id: { $in: ids } }).session(session);
    if (!data.length) {
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
      await userModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } },
        { session }
      );
    } else {
      // RSD → restore
      await userModel.updateMany(
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

    const data = await userModel.find({ _id: { $in: ids } }).lean()
    if (!data.length) {
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
    await userModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data deleted permanently.");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}
