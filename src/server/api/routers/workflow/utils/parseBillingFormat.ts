import * as cheerio from "cheerio";
import { parseList } from "./parseList";
import { normalizeItemData } from "./normalizeItemData";

export interface BillingInfo {
  name: string;
  email: string;
  id: string;
  [key: string]: string; // Allow for additional fields
}

export interface BillingData {
  billingInfo: BillingInfo;
  items: ReturnType<typeof normalizeItemData>;
}

/**
 * Parses the billing format HTML which contains:
 * - A billing info section (ul) with Name, Email, Id
 * - An items section (ol) with nested item details
 */
export function parseBillingFormat(html: string): BillingData | null {
  const $ = cheerio.load(html);

  // Extract billing info from first <ul>
  const $billingUl = $("ul").first();

  if ($billingUl.length === 0) {
    console.error("No <ul> found for billing info");
    return null;
  }

  const billingInfoRaw: Record<string, string> = {};

  $billingUl.find("> li").each((_, li) => {
    const text = $(li).text().trim();
    // Parse key-value pairs like "Name: Jabez"
    const match = text.match(/^([A-Za-z]+):\s*(.*)$/);
    if (match && match[1] && match[2]) {
      billingInfoRaw[match[1].toLowerCase()] = match[2].trim();
    }
  });

  // Extract items from <ol>
  const $itemsOl = $("ol").first();

  if ($itemsOl.length === 0) {
    console.error("No <ol> found for items");
    return null;
  }

  const rawItems = parseList($itemsOl, $);
  const items = normalizeItemData(rawItems);

  return {
    billingInfo: {
      name: billingInfoRaw.name ?? "",
      email: billingInfoRaw.email ?? "",
      id: billingInfoRaw.id ?? "",
      ...billingInfoRaw, // Include any additional fields
    },
    items,
  };
}
