interface NormalizedObject {
  name: string;
  cost: number | string;
  qty: number;
  [key: string]: any; // Allow for other keys if they appear
}

interface RawItem {
  name: string;
  children?: { name: string }[];
}

export function normalizeItemData(
  rawItems: RawItem[],
): NormalizedObject[] {
  // Map over ALL items in the array
  const normalizedObjects = rawItems.map((rootItem) => {
    if (!rootItem || !rootItem.children) {
      console.error("Input array format is incorrect or missing children.");
      return null;
    }

    // Initialize the result object
    const normalizedObject: Partial<NormalizedObject> = {};

    // Define a regex to capture key and value from strings like "Name: Something"
    // It captures: (Key) : (Value)
    const PARSING_REGEX = /^([A-Za-z]+):\s*(.*)$/;

    for (const child of rootItem.children) {
      const match = child.name.match(PARSING_REGEX);

      if (match) {
        // The groups captured by the regex:
        // match[1]: The key (e.g., "Name", "Cost", "Qty")
        // match[2]: The value (e.g., "Something", "$50", "1")
        const rawKey = match[1]?.toLowerCase();
        let rawValue: string | number | undefined = match[2]?.trim();

        if (!rawValue || !rawKey) {
          continue;
        }

        let key: string;
        let value: string | number;

        // 1. Normalize Keys (e.g., "Name" -> "name")
        switch (rawKey) {
          case "name":
            key = "name";
            value = rawValue; // string
            break;
          case "cost":
            key = "cost";
            // Clean the cost string by removing currency symbols and commas
            value = String(rawValue).replace(/[^0-9.]/g, "");
            break;
          case "total":
            key = "total";
            // Clean the total string by removing currency symbols and commas
            value = String(rawValue).replace(/[^0-9.]/g, "");
            break;
          case "qty":
            key = "qty";
            // Convert Quantity to a number
            value = parseInt(String(rawValue), 10);
            // Check if the conversion resulted in a valid number
            if (isNaN(value)) {
              console.warn(
                `Could not parse Qty value: ${rawValue}. Defaulting to 1.`,
              );
              value = 1;
            }
            break;
          default:
            // Handle any other unrecognized keys just by using their lowercased name
            key = rawKey;
            value = rawValue;
        }

        // 2. Assign the key/value pair to the result object
        normalizedObject[key as keyof NormalizedObject] = value;
      } else {
        console.warn(`Skipping malformed child string: "${child.name}"`);
      }
    }

    // Return the completed normalized object after processing all children
    return normalizedObject as NormalizedObject;
  });

  // Filter out any null values
  return normalizedObjects.filter(Boolean) as NormalizedObject[];
}
