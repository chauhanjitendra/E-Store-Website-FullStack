import {z} from 'zod';

export const zSchema = z.object({
    email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),

    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
      // .regex(/^[A-Za-z ]+$/, "Name can contain only letters and spaces"),

    otp: z.string().regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits"}),

    _id: z.string().min(3, '_id is required'),
    alt: z.string().min(3, '_AlT is required'),
    title: z.string().min(3, '_Title is required'),
    slug: z.string().min(3, 'Slug is required'),

    category: z.string().min(3, 'Category is required.'),
    mrp: z.union([
      z.number().positive('Expected positive value, received negative.'),
      z.string().transform((val)=>Number(val)).refine((val)=> !isNaN(val) && val >=0, 'Please Enter a Valid Number.')
    ]),

    sellingPrice: z.union([
      z.number().positive('Expected positive value, received negative.'),
      z.string().transform((val)=>Number(val)).refine((val)=> !isNaN(val) && val >=0, 'Please Enter a Valid Number.')
    ]),

    discountPercentages: z.union([
      z.number().positive('Expected positive value, received negative.'),
      z.string().transform((val)=>Number(val)).refine((val)=> !isNaN(val) && val >=0, 'Please Enter a Valid Number.')
    ]),

    description: z.string().min(3, 'Description is Required.'),
    media: z.array(z.string()),
    product: z.string().min(3, 'Product is required.'),
    color: z.string().min(3, 'Color is required.'),
    size: z.string().min(1, 'Size is required.'),
    sku: z.string().min(3, 'Sku is required.'),
    code: z.string().min(3, 'Code is required.'),
    minShoppingAmount: z.union([
      z.number().positive('Expected positive value, received negative.'),
      z.string().transform((val)=>Number(val)).refine((val)=> !isNaN(val) && val >=0, 'Please Enter a Valid Number.')
    ]),
    validity: z.coerce.date()
})