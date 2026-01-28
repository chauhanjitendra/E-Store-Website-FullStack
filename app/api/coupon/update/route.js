import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.Model";


export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    const Schema = zSchema.pick({
      _id: true,
      code: true,
      discountPercentages: true,
      minShoppingAmount: true,
      validity: true,
    });

    const validate = Schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or Missing fields.", validate.error);
    }

    const validatedData = validate.data;

    const getCoupon = await CouponModel.findOne({ deletedAt: null, _id: validatedData._id })
    if (!getCoupon) {
      return response(false, 404, "Data Note Found.");
    }

    getCoupon.code = validatedData.code;
    getCoupon.discountPercentage = validatedData.discountPercentages;
    getCoupon.minShoppingAmount = validatedData.minShoppingAmount;
    getCoupon.validity = validatedData.validity;

    await getCoupon.save()

    return response(true, 200, "Coupon Updated Successfully.");
  } catch (error) {
    return catchError(error);
  }
}



// import { isAuthenticated } from "@/lib/authServer";
// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import { zSchema } from "@/lib/zodSchema";
// import CouponModel from "@/models/Coupon.Model";


// export async function POST(request) {
//   try {
//     const auth = await isAuthenticated("admin");
//     if (!auth.isAuth) {
//       return response(false, 403, "Unauthorized.");
//     }

//     await connectDB();

//     const payload = await request.json();

//     const Schema = zSchema.pick({
//       _id: true,
//       code: true,
//       discountPercentages: true,
//       minShoppingAmount: true,
//       validity: true,
//     });

//     const validate = Schema.safeParse(payload);
//     if (!validate.success) {
//       return response(false, 400, "Invalid or Missing fields.", validate.error);
//     }

//     const validatedData = validate.data;

//     const getCoupon = await CouponModel.findOne({
//       _id: validatedData._id,
//       deletedAt: null,
//     });

//     if (!getCoupon) {
//       return response(false, 404, "Data Not Found.");
//     }

//     // 🔹 Normalize existing DB data
//     const dbData = {
//       name: getCoupon.name,
//       slug: getCoupon.slug,
//       category: getCoupon.category.toString(),
//       mrp: Number(getCoupon.mrp),
//       sellingPrice: Number(getCoupon.sellingPrice),
//       discountPercentages: Number(getCoupon.discountPercentages),
//       description: decode(getCoupon.description).trim(),
//       media: getCoupon.media.map((m) => m.toString()).sort().join(","),
//     };

//     // 🔹 Normalize incoming payload
//     const incomingData = {
//       name: validatedData.name,
//       slug: validatedData.slug,
//       category: validatedData.category.toString(),
//       mrp: Number(validatedData.mrp),
//       sellingPrice: Number(validatedData.sellingPrice),
//       discountPercentages: Number(validatedData.discountPercentages),
//       description: validatedData.description.trim(),
//       media: validatedData.media.map((m) => m.toString()).sort().join(","),
//     };

//     // 🔹 Check if anything changed
//     const hasChanges = Object.keys(dbData).some(
//       (key) => dbData[key] !== incomingData[key]
//     );

//     if (!hasChanges) {
//       return response(false, 400, "Invalid or Missing fields.");
//     }

//     // 🔹 Apply changes
//     getCoupon.name = validatedData.name;
//     getCoupon.slug = validatedData.slug;
//     getCoupon.category = validatedData.category;
//     getCoupon.mrp = validatedData.mrp;
//     getCoupon.sellingPrice = validatedData.sellingPrice;
//     getCoupon.discountPercentages = validatedData.discountPercentages;
//     getCoupon.description = encode(validatedData.description);
//     getCoupon.media = validatedData.media;

//     await getCoupon.save();

//     return response(true, 200, "Product Updated Successfully.");
//   } catch (error) {
//     return catchError(error);
//   }
// }
