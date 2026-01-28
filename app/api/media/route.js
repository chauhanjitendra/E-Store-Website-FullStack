import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.Model";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            console.log("MEDIA GET: Unauthorized access attempt");
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page'), 10) || 0
        const limit = parseInt(searchParams.get('limit'), 10) || 10
        const deleteType = searchParams.get('deleteType')

        console.log(`FETCH MEDIA: page=${page}, deleteType=${deleteType}`);

        let filter = {}
        if (deleteType === 'SD') {
            filter = { deletedAt: null }
        } else if (deleteType === 'PD') {
            filter = { deletedAt: { $ne: null } }
        }

        const mediaData = await MediaModel.find(filter).sort({ createdAt: -1 }).skip(page * limit).limit(limit).lean()
        const totalMedia = await MediaModel.countDocuments(filter)

        console.log(`MEDIA FOUND: ${mediaData.length}`);

        return NextResponse.json({
            mediaData: mediaData,
            hasMore: ((page + 1) * limit) < totalMedia
        })

    } catch (error) {
        console.error("MEDIA GET ERROR:", error);
        return catchError(error)
    }
}

