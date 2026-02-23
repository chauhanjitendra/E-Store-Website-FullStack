"use client";
import useFetch from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ButtonLoading from "../ButtonLoading";
import { useRouter, useSearchParams } from "next/navigation";
import { WEBSITE_HOME, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Filter = () => {
  const searchParams = useSearchParams();

  const [priceFilter, setPriceFilter] = useState({
    minPrice: 0,
    maxPrice: 3000,
  });
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);

  const { data: categoryData } = useFetch("/api/category/get-category");
  const { data: colorData } = useFetch("/api/product-variant/colors");
  const { data: sizeData } = useFetch("/api/product-variant/sizes");

  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  useEffect(() => {
    searchParams.get("Category")
      ? setSelectedCategory(searchParams.get("Category").split(","))
      : setSelectedCategory([]);

    searchParams.get("color")
      ? setSelectedColor(searchParams.get("color").split(","))
      : setSelectedColor([]);

    searchParams.get("size")
      ? setSelectedSize(searchParams.get("size").split(","))
      : setSelectedSize([]);
  }, [searchParams]);

  const handlePriceChanges = (value) => {
    setPriceFilter({ minPrice: value[0], maxPrice: value[1] });
  };

  const handleCategoryFilter = (categoryslug) => {
    let newSelectedCategory = [...selectedCategory];
    if (newSelectedCategory.includes(categoryslug)) {
      newSelectedCategory = newSelectedCategory.filter(
        (cat) => cat !== categoryslug,
      );
    } else {
      newSelectedCategory.push(categoryslug);
    }
    setSelectedCategory(newSelectedCategory);
    newSelectedCategory.length > 0
      ? urlSearchParams.set("Category", newSelectedCategory.join(","))
      : urlSearchParams.delete("Category");
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const handleColorFilter = (color) => {
    let newSelectedColor = [...selectedColor];
    if (newSelectedColor.includes(color)) {
      newSelectedColor = newSelectedColor.filter((cat) => cat !== color);
    } else {
      newSelectedColor.push(color);
    }
    setSelectedColor(newSelectedColor);
    newSelectedColor.length > 0
      ? urlSearchParams.set("color", newSelectedColor.join(","))
      : urlSearchParams.delete("color");
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const handleSizeFilter = (size) => {
    let newSelectedsize = [...selectedSize];

    if (newSelectedsize.includes(size)) {
      newSelectedsize = newSelectedsize.filter((cat) => cat !== size);
    } else {
      newSelectedsize.push(size);
    }
    setSelectedSize(newSelectedsize);

    newSelectedsize.length > 0
      ? urlSearchParams.set("size", newSelectedsize.join(","))
      : urlSearchParams.delete("size");
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  const handlePriceFilter = ()=>{
    urlSearchParams.set('minPrice', priceFilter.minPrice)
    urlSearchParams.set('maxPrice', priceFilter.maxPrice)
     router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  }

  return (
    <div>
      {searchParams.size > 0 &&
        <Button type='button' asChild variant="destructive" className='w-full'>
          <Link href={WEBSITE_SHOP}>
              Clear Filter
          </Link>
        </Button>
      }
      <Accordion type="multiple" defaultValue={["1", "2", "3", "4"]}>
        <AccordionItem value="1">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {categoryData &&
                  categoryData.success &&
                  categoryData.data.map((Category) => (
                    <li key={Category._id} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() =>
                            handleCategoryFilter(Category.slug)
                          }
                          checked={selectedCategory.includes(Category.slug)}
                        />
                        <span>{Category.name}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Color
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {colorData &&
                  colorData.success &&
                  colorData.data.map((color) => (
                    <li key={color} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() => handleColorFilter(color)}
                          checked={selectedColor.includes(color)}
                        />
                        <span>{color}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {sizeData &&
                  sizeData.success &&
                  sizeData.data.map((size) => (
                    <li key={size} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() => handleSizeFilter(size)}
                          checked={selectedSize.includes(size)}
                        />
                        <span>{size}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="4">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <Slider
              defaultValue={[0, 3000]}
              max={3000}
              step={1}
              onValueChange={handlePriceChanges}
            />
            <div className="flex justify-between items-center pt-2">
              <span>
                {priceFilter.minPrice.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
              <span>
                {priceFilter.maxPrice.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            </div>
            <div className="mt-5">
              <ButtonLoading
                type="button"
                text="Filter Price"
                onClick={handlePriceFilter}
                className="rounded-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;
