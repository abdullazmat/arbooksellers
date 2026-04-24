import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Stable date formatting utility that won't cause hydration issues
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", defaultOptions);
  } catch (error) {
    return "Invalid Date";
  }
}

// Stable date formatting with time
export function formatDateTime(dateString: string) {
  return formatDate(dateString, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Price formatting utility for Indian/Pakistani format (Rs 12,34,000)
export function formatPrice(amount: number, currency: string = "Rs") {
  try {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return `${currency} 0`;
    }

    // Convert to integer (remove decimal places for display)
    const integerAmount = Math.floor(amount);

    // Use standard number formatting with Indian locale
    const formatter = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return `${currency} ${formatter.format(integerAmount)}`;
  } catch (error) {
    console.error("Error formatting price:", error);
    return `${currency} 0`;
  }
}

// Price formatting with decimal places option
export function formatPriceWithDecimals(
  amount: number,
  currency: string = "Rs",
  decimals: number = 2,
) {
  try {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return `${currency} 0`;
    }

    // Use standard number formatting with Indian locale
    const formatter = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return `${currency} ${formatter.format(amount)}`;
  } catch (error) {
    console.error("Error formatting price:", error);
    return `${currency} 0`;
  }
}

// Generate unique order number
export function generateOrderNumber(): string {
  // Generate a 6-digit numeric order number
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const orderNumber = ((timestamp % 1000000) + random) % 1000000;
  const paddedOrderNumber = orderNumber.toString().padStart(6, "0");

  return paddedOrderNumber;
}

export function clearExpiredAdminTokens() {
  try {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      const tokenPayload = JSON.parse(atob(adminToken.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenPayload.exp && tokenPayload.exp < currentTime) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        return true; // Token was expired and cleared
      }
    }
    return false; // No expired token found
  } catch (error) {
    // If we can't parse the token, clear it anyway
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    return true; // Token was invalid and cleared
  }
}

// Product image base URL (use env in production)
export const IMAGE_BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL) ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "https://arbooksellers.com");

/**
 * Returns full URL for a product image. Handles relative paths, full URLs, and base64.
 * Use for all product image src values.
 */
export function getProductImageUrl(
  url: string | undefined | null,
  placeholder: string = "/placeholder.svg",
  absolute: boolean = false,
): string {
  if (!url || typeof url !== "string") return placeholder;
  if (url.startsWith("data:")) return url; // base64
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // If it's an absolute URL to our own site, convert to relative to avoid cross-domain issues in dev
    if (
      url.includes("arbooksellers.com") ||
      (typeof window !== "undefined" && url.includes(window.location.hostname))
    ) {
      const match = url.match(/(\/uploads\/.*)/);
      if (match) return match[1];
    }
    return url;
  }

  const path = url.startsWith("/") ? url : `/${url}`;

  // Return relative path for UI components unless absolute is explicitly requested
  if (!absolute) {
    return path;
  }

  return `${IMAGE_BASE_URL}${path}`;
}

/**
 * Converts plain text with newlines into HTML-formatted text with proper paragraphs and line breaks.
 * Detects and converts inline key:value patterns and traditional bullet points into HTML lists.
 * - Single newlines become `<br/>`
 * - Double newlines create separate paragraphs
 * - Key: Value patterns become <li> items
 * - Bullet lines (-, *, •, 1., etc.) become <li> items
 * - Inline key:value patterns are auto-split into list items
 */
export function formatTextWithLineBreaks(
  text: string | undefined | null,
): string {
  if (!text || typeof text !== "string") {
    return "No description available.";
  }

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const isBulletLine = (line: string) => /^([-*•]|\d+[.)])\s+/.test(line);
  const stripBullet = (line: string) =>
    line.replace(/^([-*•]|\d+[.)])\s+/, "").trim();
  const keyValueMatch = (line: string) =>
    /^([A-Za-z&\s\-][A-Za-z&\s0-9\-]{1,50}):\s+(.+)$/.exec(line);

  // First, pre-process text to split inline "Key: Value" patterns into separate lines
  // This regex finds patterns like "Previous text. Key: Value text. Next" and splits them
  // Allows letters, ampersands, hyphens, spaces, and numbers in key labels (e.g., "Built to Last", "Travel-Friendly Size", "Clear & Clean Printing")
  let processedText = text.replace(
    /([.!?])\s+([A-Z][A-Za-z&\s0-9\-]{1,50}):\s+/g,
    "$1\n$2: ",
  );

  const sourceLines = processedText.replace(/\r\n?/g, "\n").split("\n");
  const blocks: string[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    const content = escapeHtml(paragraphLines.join(" "));
    blocks.push(`<p>${content}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(`<ul>${listItems.join("")}</ul>`);
    listItems = [];
  };

  for (const rawLine of sourceLines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const kv = keyValueMatch(line);

    if (isBulletLine(line) || kv) {
      flushParagraph();

      const content = isBulletLine(line) ? stripBullet(line) : line;
      const parsedKv = keyValueMatch(content);

      if (parsedKv) {
        const label = escapeHtml(parsedKv[1].trim());
        const value = escapeHtml(parsedKv[2].trim());
        listItems.push(`<li><strong>${label}:</strong> ${value}</li>`);
      } else {
        listItems.push(`<li>${escapeHtml(content)}</li>`);
      }
      continue;
    }

    if (listItems.length > 0) {
      const last = listItems[listItems.length - 1];
      const continuation = escapeHtml(line);
      listItems[listItems.length - 1] = last.replace(
        "</li>",
        ` ${continuation}</li>`,
      );
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks.length > 0
    ? blocks.join("")
    : `<p>${escapeHtml(text.trim())}</p>`;
}
