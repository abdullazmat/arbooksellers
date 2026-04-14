import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

const ASAN_FOCUS_KEYWORD = "ASAN TARJUMA Quran Dr ISRAR AHMAD";
const ASAN_SEO_TITLE = "Asan Tarjuma Quran by Dr. Israr Ahmad";
const ASAN_SEO_DESCRIPTION_BASE =
  "ASAN TARJUMA Quran Dr ISRAR AHMAD in simple Urdu with clear offset paper and hard binding, ideal for daily recitation and easy Tafseer study at home.";

const NOBEL_FOCUS_KEYWORD = "Noble Quran Mufti Taqi Usmani";
const NOBEL_SEO_TITLE =
  "Noble Quran Majeed with Explanatory Notes by Mufti Taqi Usmani";
const NOBEL_SEO_DESCRIPTION_BASE =
  "Get printed Noble Quran with easy explanatory notes by Mufti Taqi Usmani. High-quality binding and simple Urdu/English translation.";

function normalizeText(value?: string) {
  return (value || "").trim().toLowerCase();
}

function to140Chars(value: string) {
  if (value.length <= 140) {
    return value;
  }

  return `${value.slice(0, 137).trimEnd()}...`;
}

function isAsanTarjumaProduct(
  product: { title?: string; author?: string } | null,
) {
  if (!product) {
    return false;
  }

  const title = normalizeText(product.title);
  const author = normalizeText(product.author);

  return title === "asan tarjuma" && author === "dr. israr ahmad sb";
}

function isNobelQuranProduct(
  product: { title?: string; author?: string } | null,
) {
  if (!product) {
    return false;
  }

  const title = normalizeText(product.title);
  const author = normalizeText(product.author);

  return (
    title === "nobel quran majeed with explanatory notes" &&
    author === "mufti muhammad taqi usmani sb"
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    await dbConnect();
    
    let product;
    if (mongoose.isValidObjectId(id)) {
      product = await Product.findById(id)
        .select("title author description metaTitle metaDescription focusKeyword")
        .lean<{ title?: string; author?: string; description?: string; metaTitle?: string; metaDescription?: string; focusKeyword?: string }>();
    } else {
      product = await Product.findOne({ slug: id })
        .select("title author description metaTitle metaDescription focusKeyword")
        .lean<{ title?: string; author?: string; description?: string; metaTitle?: string; metaDescription?: string; focusKeyword?: string }>();
    }

    if (isAsanTarjumaProduct(product)) {
      const description = to140Chars(ASAN_SEO_DESCRIPTION_BASE);

      return {
        title: {
          absolute: ASAN_SEO_TITLE,
        },
        description,
        keywords: [
          ASAN_FOCUS_KEYWORD,
          "ASAN TARJUMA Quran",
          "Dr Israr Ahmad",
          "Urdu Quran translation",
          "Tafseer",
        ],
        openGraph: {
          title: ASAN_SEO_TITLE,
          description,
          type: "website",
        },
        twitter: {
          card: "summary",
          title: ASAN_SEO_TITLE,
          description,
        },
      };
    }

    if (isNobelQuranProduct(product)) {
      const description = to140Chars(NOBEL_SEO_DESCRIPTION_BASE);

      return {
        title: {
          absolute: NOBEL_SEO_TITLE,
        },
        description,
        keywords: [
          NOBEL_FOCUS_KEYWORD,
          "Noble Quran Majeed",
          "Mufti Taqi Usmani",
          "Explanatory notes",
          "Quran with translation",
        ],
        openGraph: {
          title: NOBEL_SEO_TITLE,
          description,
          type: "website",
        },
        twitter: {
          card: "summary",
          title: NOBEL_SEO_TITLE,
          description,
        },
      };
    }

    const fallbackTitle = product?.metaTitle || product?.title || "Product Details";
    const fallbackDescription = to140Chars(
      product?.metaDescription ||
        product?.description ||
        "Shop authentic Quran and Islamic books online from AR Book Sellers with fast delivery across Pakistan.",
    );

    return {
      title: {
        absolute: fallbackTitle,
      },
      description: fallbackDescription,
      keywords: product?.focusKeyword ? [product.focusKeyword] : ["Islamic books", "Quran"],
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: fallbackTitle,
        description: fallbackDescription,
      },
    };
  } catch {
    const fallbackDescription = to140Chars(
      "Shop authentic Quran and Islamic books online from AR Book Sellers with fast delivery across Pakistan.",
    );

    return {
      title: {
        absolute: "Product Details",
      },
      description: fallbackDescription,
    };
  }
}

export default function ProductDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
