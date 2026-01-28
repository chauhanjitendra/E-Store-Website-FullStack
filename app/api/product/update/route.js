// import { isAuthenticated } from "@/lib/authServer";
// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import { zSchema } from "@/lib/zodSchema";
// import ProductModel from "@/models/Product.model";
// import { encode } from "entities";

// export async function POST(request) {
//   try {
//     const auth = await isAuthenticated("admin");
//     if (!auth.isAuth) {
//       return response(false, 403, "Unauthorized.");
//     }

//     await connectDB();

//     const payload = await request.json();

//      const Schema = zSchema.pick({
//           _id: true,
//           name: true,
//           slug: true,
//           category: true,
//           mrp: true,
//           sellingPrice: true,
//           discountPercentages: true,
//           description: true,
//           media: true
//         });

//     const validate = Schema.safeParse(payload);
//     if (!validate.success) {
//       return response(false, 400, "Invalid or Missing fields.", validate.error);
//     }

//     const validatedData = validate.data;

//     const getProduct = await ProductModel.findOne({ deletedAt: null,_id: validatedData._id})
//     if(!getProduct){
//       return response(false, 404, "Data Note Found.");
//     }
//     getProduct.name = validatedData.name
//     getProduct.slug = validatedData.slug
//     getProduct.category = validatedData.category
//     getProduct.mrp = validatedData.mrp
//     getProduct.sellingPrice = validatedData.sellingPrice
//     getProduct.discountPercentages = validatedData.discountPercentages
//     getProduct.description = encode(validatedData.description)
//     getProduct.media = validatedData.media
//     await getProduct.save()

//     return response(true, 200, "Product Updated Successfully.");
//   } catch (error) {
//     return catchError(error);
//   }
// }



import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import { encode, decode } from "entities";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    const Schema = zSchema.pick({
      _id: true,
      name: true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentages: true,
      description: true,
      media: true,
    });

    const validate = Schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or Missing fields.", validate.error);
    }

    const validatedData = validate.data;

    const getProduct = await ProductModel.findOne({
      _id: validatedData._id,
      deletedAt: null,
    });

    if (!getProduct) {
      return response(false, 404, "Data Not Found.");
    }

    // 🔹 Normalize existing DB data
    const dbData = {
      name: getProduct.name,
      slug: getProduct.slug,
      category: getProduct.category.toString(),
      mrp: Number(getProduct.mrp),
      sellingPrice: Number(getProduct.sellingPrice),
      discountPercentages: Number(getProduct.discountPercentages),
      description: decode(getProduct.description).trim(),
      media: getProduct.media.map((m) => m.toString()).sort().join(","),
    };

    // 🔹 Normalize incoming payload
    const incomingData = {
      name: validatedData.name,
      slug: validatedData.slug,
      category: validatedData.category.toString(),
      mrp: Number(validatedData.mrp),
      sellingPrice: Number(validatedData.sellingPrice),
      discountPercentages: Number(validatedData.discountPercentages),
      description: validatedData.description.trim(),
      media: validatedData.media.map((m) => m.toString()).sort().join(","),
    };

    // 🔹 Check if anything changed
    const hasChanges = Object.keys(dbData).some(
      (key) => dbData[key] !== incomingData[key]
    );

    if (!hasChanges) {
      return response(false, 400, "Invalid or Missing fields.");
    }

    // 🔹 Apply changes
    getProduct.name = validatedData.name;
    getProduct.slug = validatedData.slug;
    getProduct.category = validatedData.category;
    getProduct.mrp = validatedData.mrp;
    getProduct.sellingPrice = validatedData.sellingPrice;
    getProduct.discountPercentages = validatedData.discountPercentages;
    getProduct.description = encode(validatedData.description);
    getProduct.media = validatedData.media;

    await getProduct.save();

    return response(true, 200, "Product Updated Successfully.");
  } catch (error) {
    return catchError(error);
  }
}
