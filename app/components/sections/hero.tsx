import { resolveShopifyLink } from "@/app/lib/shopify/utils";
import { log } from "console";
import Image from "next/image";

const resolveShopifyImage = (src) => {
  if (!src) return null;

  if (src.startsWith("shopify://")) {
    const fileName = src.replace("shopify://shop_images/", "");
    return `https://cdn.shopify.com/s/files/1/0674/5830/2029/files/${fileName}`;
  }

  return src;
};

export default function Hero({ settings, blocks }) {
  log("settings", settings);
  const {
    image_1,
    image_2,
    media_type_1,
    media_type_2,
    section_height,
    toggle_overlay,
    overlay_color,
    overlay_style,
    gradient_direction,
    content_direction,
    horizontal_alignment_flex_direction_column,
    vertical_alignment_flex_direction_column,
    gap,
  } = settings || {};

  const image1Url = resolveShopifyImage(image_1);
  const image2Url = resolveShopifyImage(image_2);

  const renderMedia = (type, src, key) => {
    if (type === "image" && src) {
      return <Image key={key} src={src} alt="" fill className="object-cover" priority />;
    }
    return null;
  };

  const heightClass =
    section_height === "full-screen" ? "min-h-screen" : section_height === "large" ? "min-h-[80vh]" : "min-h-[500px]";

  const overlayStyle =
    overlay_style === "gradient"
      ? {
          background: `linear-gradient(${gradient_direction}, ${overlay_color}, transparent)`,
        }
      : {
          backgroundColor: overlay_color,
        };

  return (
    <section className={`relative w-full ${heightClass} content-center`}>
      <div className={`absolute inset-0 grid grid-cols-1 ${image1Url && image2Url && "md:grid-cols-2"}`}>
        <div className="relative w-full h-full">{renderMedia(media_type_1, image1Url, "media1")}</div>

        {image2Url && <div className="relative w-full h-full">{renderMedia(media_type_2, image2Url, "media2")}</div>}
      </div>

      {toggle_overlay && <div className="absolute inset-0 z-10" style={overlayStyle} />}

      <div
        className="relative z-20 flex w-full h-full px-6"
        style={{
          flexDirection: content_direction,
          justifyContent: vertical_alignment_flex_direction_column,
          alignItems: horizontal_alignment_flex_direction_column,
          gap: `${gap}px`,
        }}
      >
        {blocks &&
          Object.entries(blocks).map(([id, block]) => {
            if (block.type === "text") {
              return (
                <div
                  key={id}
                  className="text-white"
                  dangerouslySetInnerHTML={{
                    __html: block.settings?.text || "",
                  }}
                />
              );
            }

            if (block.type === "button") {
              const href = resolveShopifyLink(block.settings?.link);

              return (
                <a key={id} href={href} className="px-6 py-3 bg-white text-black rounded">
                  {block.settings?.label}
                </a>
              );
            }

            return null;
          })}
      </div>
    </section>
  );
}
