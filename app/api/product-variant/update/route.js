import { isAuthenticated } from "@/lib/authServer";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    const schema = zSchema.pick({
      _id: true,
      product: true,
      sku: true,
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      media: true,
    });

    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or Missing fields.", validate.error);
    }

    const validatedData = validate.data;

    // Normalize/compute discountPercentages: accept either `discountPercentages` or `discountPercentage` from payload
    let finalDiscount = null;
    if (payload.discountPercentages !== undefined && payload.discountPercentages !== null) {
      finalDiscount = Number(payload.discountPercentages);
    } else if (payload.discountPercentage !== undefined && payload.discountPercentage !== null) {
      finalDiscount = Number(payload.discountPercentage);
    } else {
      const mrpVal = Number(validatedData.mrp);
      const sellVal = Number(validatedData.sellingPrice);
      if (mrpVal && mrpVal > 0 && !isNaN(sellVal)) {
        finalDiscount = Math.round(((mrpVal - sellVal) / mrpVal) * 100);
      } else {
        finalDiscount = 0;
      }
    }
    validatedData.discountPercentages = finalDiscount;

    const getProductVariant = await ProductVariantModel.findOne({
      deletedAt: null,
      _id: validatedData._id,
    });
    if (!getProductVariant) {
      return response(false, 404, "Data Note Found.");
    }
    getProductVariant.product = validatedData.product;
    getProductVariant.sku = validatedData.sku;
    getProductVariant.color = validatedData.color;
    getProductVariant.size = validatedData.size;
    getProductVariant.mrp = validatedData.mrp;
    getProductVariant.sellingPrice = validatedData.sellingPrice;
    getProductVariant.discountPercentages = validatedData.discountPercentages;
    getProductVariant.media = validatedData.media;
    await getProductVariant.save();

    return response(true, 200, "Product Variant Updated Successfully.");
  } catch (error) {
    return catchError(error);
  }
}

// import { isAuthenticated } from "@/lib/authServer";
// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import { zSchema } from "@/lib/zodSchema";
// import ProductModel from "@/models/Product.model";
// import { encode, decode } from "entities";

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
//       name: true,
//       slug: true,
//       category: true,
//       mrp: true,
//       sellingPrice: true,
//       discountPercentages: true,
//       description: true,
//       media: true,
//     });

//     const validate = Schema.safeParse(payload);
//     if (!validate.success) {
//       return response(false, 400, "Invalid or Missing fields.", validate.error);
//     }

//     const validatedData = validate.data;

//     const getProductVariant = await ProductModel.findOne({
//       _id: validatedData._id,
//       deletedAt: null,
//     });

//     if (!getProductVariant) {
//       return response(false, 404, "Data Not Found.");
//     }

//     // 🔹 Normalize existing DB data
//     const dbData = {
//       name: getProductVariant.name,
//       slug: getProductVariant.slug,
//       category: getProductVariant.category.toString(),
//       mrp: Number(getProductVariant.mrp),
//       sellingPrice: Number(getProductVariant.sellingPrice),
//       discountPercentages: Number(getProductVariant.discountPercentages),
//       description: decode(getProductVariant.description).trim(),
//       media: getProductVariant.media.map((m) => m.toString()).sort().join(","),
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
//     getProductVariant.name = validatedData.name;
//     getProductVariant.slug = validatedData.slug;
//     getProductVariant.category = validatedData.category;
//     getProductVariant.mrp = validatedData.mrp;
//     getProductVariant.sellingPrice = validatedData.sellingPrice;
//     getProductVariant.discountPercentages = validatedData.discountPercentages;
//     getProductVariant.description = encode(validatedData.description);
//     getProductVariant.media = validatedData.media;

//     await getProductVariant.save();

//     return response(true, 200, "Product Updated Successfully.");
//   } catch (error) {
//     return catchError(error);
//   }
// }
