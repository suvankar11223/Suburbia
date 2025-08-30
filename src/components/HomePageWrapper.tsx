import { SliceComponentProps, SliceZone } from "@prismicio/react";
import { Content } from "@prismicio/client";
import { components } from "@/slices";

interface HomePageWrapperProps {
  slices: (
    | Content.HomepageDocumentDataSlicesSlice
    | {
        id: string;
        slice_type: "text_and_image_bundle";
        slices: Content.TextAndImageSlice[];
      }
  )[];
}

export function HomePageWrapper({ slices }: HomePageWrapperProps) {
  return (
    <SliceZone
      slices={slices}
      components={{
        ...components,
        text_and_image_bundle: ({
          slice,
        }: SliceComponentProps<{
          id: string;
          slice_type: "text_and_image_bundle";
          slices: Content.TextAndImageSlice[];
        }>) => (
          <div>
            <SliceZone slices={slice.slices} components={components} />
          </div>
        ),
      }}
    />
  );
}