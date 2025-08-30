"use client";

import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react";

import { createClient } from "@/prismicio";
import { ButtonLink } from "@/components/ButtonLink";
import { HorizontalLine, VerticalLine } from "@/components/Line";
import clsx from "clsx";
import { Scribble } from "./Scribble";

function getDominantColor(url: string) {
  const paletteURL = new URL(url);
  paletteURL.searchParams.set("palette", "json");

  return fetch(paletteURL)
    .then((res) => res.json())
    .then((json) =>
      json.dominant_colors.vibrant?.hex || json.dominant_colors.vibrant_light?.hex
    );
}

type Props = {
  id: string;
};

const VERTICAL_LINE_CLASSES =
  "absolute top-0 h-full stroke-2 text-stone-300 transition-colors group-hover:text-stone-400";

const HORIZONTAL_LINE_CLASSES =
  "-mx-8 stroke-2 text-stone-300 transition-colors group-hover:text-stone-400";

export function SkateboardProduct({ id }: Props) {
  const [product, setProduct] = useState<Content.SkateboardDocument | null>(null);
  const [dominantColor, setDominantColor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = () => {
      const client = createClient();
      client.getByID<Content.SkateboardDocument>(id)
        .then((productData) => {
          setProduct(productData);

          // Fetch dominant color if image exists
          if (isFilled.image(productData.data.image)) {
            getDominantColor(productData.data.image.url)
              .then(setDominantColor)
              .catch((error) => {
                console.error("Failed to fetch dominant color:", error);
              });
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch product:", error);
          setLoading(false);
        });
    };

    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="group relative mx-auto w-full max-w-72 px-8 pt-4">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  const price = isFilled.number(product.data.price)
    ? `$${(product.data.price / 100).toFixed(2)}`
    : "Price Not Available";

  return (
    <div className="group relative mx-auto w-full max-w-72 px-8 pt-4 ">
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, "left-4")} />
      <VerticalLine className={clsx(VERTICAL_LINE_CLASSES, "right-4")} />
      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />

      <div className="flex items-center justify-between ~text-sm/2xl">
        <span>{price}</span>
        <span className="inline-flex items-center gap-1">
          <FaStar className="text-yellow-400" /> 37
        </span>
      </div>
      <div className="-mb-1 overflow-hidden py-4">
        <Scribble
          className="absolute inset-0 h-full w-full"
          color={dominantColor}
        />
        <PrismicNextImage
          alt=""
          field={product.data.image}
          width={150}
          className=" mx-auto w-[58%] origin-top transform-gpu transition-transform duration-500 ease-in-out group-hover:scale-150"
        />
      </div>
      <HorizontalLine className={HORIZONTAL_LINE_CLASSES} />

      <h3 className="my-2 text-center font-sans leading-tight ~text-lg/xl">
        {product.data.name}
      </h3>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <ButtonLink field={product.data.customizer_link}>Customize</ButtonLink>
      </div>
    </div>
  );
}
