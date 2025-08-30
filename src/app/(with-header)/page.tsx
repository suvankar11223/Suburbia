import { Metadata } from "next";

import { createClient } from "@/prismicio";
import { HomePageWrapper } from "@/components/HomePageWrapper";
import { Content } from "@prismicio/client";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("homepage");
  const slices = bundleTextAndImageSlices(page.data.slices);

  return <HomePageWrapper slices={slices} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("homepage");

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

type TextAndImageBundleSlice = {
  id: string;
  slice_type: "text_and_image_bundle";
  slices: Content.TextAndImageSlice[];
};

function bundleTextAndImageSlices(
  slices: Content.HomepageDocumentDataSlicesSlice[]
) {
  const res: (
    | Content.HomepageDocumentDataSlicesSlice
    | TextAndImageBundleSlice
  )[] = [];

  for (const slice of slices) {
    if (slice.slice_type !== "text_and_image") {
      res.push(slice);
      continue;
    }

    const bundle = res.at(-1);
    if (bundle?.slice_type === "text_and_image_bundle") {
      bundle.slices.push(slice);
    } else {
      res.push({
        id: `${slice.id}-bundle`,
        slice_type: "text_and_image_bundle",
        slices: [slice],
      });
    }
  }
  return res;
}
