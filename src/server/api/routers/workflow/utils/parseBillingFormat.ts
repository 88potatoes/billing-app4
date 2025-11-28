import * as cheerio from "cheerio";
import { parseList } from "./parseList";
import { normalizeItemData } from "./normalizeItemData";

export interface CustomerInfo {
  name: string;
  email: string;
  id: string;
  [key: string]: string; // Allow for additional fields
}

export interface BillingData {
  customerInfo: CustomerInfo;
  items: ReturnType<typeof normalizeItemData>;
}

/**
 * Parses the billing format HTML which contains:
 * - A customer info section (ul) with Name, Email, Id
 * - An items section (ol) with nested item details
 */
export function parseBillingFormat(html: string): BillingData | null {
  const $ = cheerio.load(html);

  // Extract customer info from first <ul>
  const $customerUl = $("ul").first();

  if ($customerUl.length === 0) {
    console.error("No <ul> found for customer info");
    return null;
  }

  const customerInfoRaw: Record<string, string> = {};

  $customerUl.find("> li").each((_, li) => {
    const text = $(li).text().trim();
    // Parse key-value pairs like "Name: Jabez"
    const match = text.match(/^([A-Za-z]+):\s*(.*)$/);
    if (match && match[1] && match[2]) {
      customerInfoRaw[match[1].toLowerCase()] = match[2].trim();
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
    customerInfo: {
      name: customerInfoRaw.name ?? "",
      email: customerInfoRaw.email ?? "",
      id: customerInfoRaw.id ?? "",
      ...customerInfoRaw, // Include any additional fields
    },
    items,
  };
}
