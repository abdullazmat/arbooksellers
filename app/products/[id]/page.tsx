import { Metadata, ResolvingMetadata } from "next";
import ProductClient from "./ProductClient";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import "@/models/Category";
import { notFound } from "next/navigation";
import mongoose from "mongoose";

interface Props {
  params: Promise<{ id: string }>;
}

function sanitizePublicImages(images: unknown): string[] {
  if (!Array.isArray(images)) return ["/placeholder.jpg"];

  const cleaned = images.filter(
    (img): img is string => typeof img === "string" && !img.startsWith("data:"),
  );

  return cleaned.length > 0 ? cleaned : ["/placeholder.jpg"];
}

async function getProduct(id: string) {
  try {
    await dbConnect();

    let query;
    if (mongoose.isValidObjectId(id)) {
      query = Product.findById(id);
    } else {
      query = Product.findOne({ slug: id });
    }

    const product = await query
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .lean();

    if (!product) return null;

    // Get count of approved dynamic comments
    const dynamicCommentsCount = await mongoose.model("Comment").countDocuments({
      productId: product._id.toString(),
      isApproved: true,
    });

    // Strip base64 data URLs for storefront responses to avoid giant payloads.
    const safeProduct = {
      ...product,
      images: sanitizePublicImages(product.images),
      dynamicCommentsCount,
    };

    // Convert Mongo specific types to plain objects for client components
    return JSON.parse(JSON.stringify(safeProduct));
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const productImages = product.images.map((img: string) =>
    img.startsWith("http")
      ? img
      : `${process.env.NEXT_PUBLIC_APP_URL || "https://arbooksellers.com"}${img}`,
  );

  return {
    title: {
      absolute: product.metaTitle || product.title,
    },
    description:
      product.metaDescription ||
      product.description?.substring(0, 160) ||
      `Buy ${product.title} from AR Book Sellers. Authentic Islamic literature.`,
    keywords: [
      product.focusKeyword,
      "Islamic books",
      "Quran",
      "Hadith",
      product.author,
    ].filter(Boolean),
    openGraph: {
      title: product.title,
      description: product.description?.substring(0, 160),
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://arbooksellers.com"}/products/${id}`,
      siteName: "AR Book Sellers",
      type: "article",
      images: [...productImages, ...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description?.substring(0, 160),
      images: productImages,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((img: string) =>
      img.startsWith("http")
        ? img
        : `${process.env.NEXT_PUBLIC_APP_URL || "https://arbooksellers.com"}${img}`,
    ),
    description: product.description,
    sku: product._id,
    mpn: product._id,
    brand: {
      "@type": "Brand",
      name: "AR Book Sellers",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://arbooksellers.com"}/products/${id}`,
      priceCurrency: "PKR",
      price: product.price,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "AR Book Sellers",
      },
    },
    ...(product.author && {
      author: { "@type": "Person", name: product.author },
    }),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL || "https://arbooksellers.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${process.env.NEXT_PUBLIC_APP_URL || "https://arbooksellers.com"}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `${process.env.NEXT_PUBLIC_APP_URL || "https://arbooksellers.com"}/products/${product.slug || id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductClient initialProduct={product} id={id} />
    </>
  );
}
