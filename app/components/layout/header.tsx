import { getMenuQuery } from "@/app/lib/shopify/queries/menu";
import { shopifyClient } from "@/app/lib/shopify/client";
import Link from "next/link";

async function getMenu(handle: string = "main-menu") {
  const variables: {
    handle: string;
  } = {
    handle,
  };

  const data = await shopifyClient.request(getMenuQuery, variables);

  return data?.menu?.items || [];
}

function formatUrl(url: string) {
  if (!url) return "#";

  return url.replace(process.env.SHOPIFY_STORE_DOMAIN!, "").replace(/^https?:\/\//, "");
}

export default async function Header() {
  const menu = await getMenu("main-menu");

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="hidden md:flex gap-6">
          {menu.map((item: any) => (
            <Link key={item.id} href={formatUrl(item.url)} className="text-gray-700 hover:text-black">
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
