import { publicClient } from "../wallet/wallet-config";

export const capitalizeFirstLetter = (str: string) => {
  // Check if the input is a non-empty string
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }

  // Capitalize the first letter and concatenate the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
};

/**
 * This function capitalizes the first letter of each word in a phrase.
 * It also replaces underscores ('_') between words with spaces and capitalizes the next letter.
 *
 * @param {string} name - The input phrase to be capitalized.
 * @returns {string} - The input phrase with the first letter of each word capitalized.
 */
export const capitalizeFirstLetterPrhases = (name: string): string => {
  let capitalizedName = capitalizeFirstLetter(name.replace("_", " "));

  const words = capitalizedName.split(" ");

  const capitalizedWords = words.map((word) => {
    return capitalizeFirstLetter(word);
  });

  capitalizedName = capitalizedWords.join(" ");

  return capitalizedName;
};

/**
 * Checks if a given value is within a specified range.
 * @param value - The value to check.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns A boolean indicating whether the value is within the range.
 */
export function isInRange(value: number, min: number, max: number) {
  return value >= min && value <= max;
}

export const getTimestamp = async (chainId: number) => {
  const provider = publicClient({
    chainId,
  });

  const block = await provider.getBlockNumber();
  const blockDetails = await provider.getBlock({ blockNumber: block });

  const timestamp = blockDetails.timestamp;

  return timestamp;
};

export const collapseAddress = (
  address: string,
  startLength = 4,
  endLength = 4,
) => {
  // Check if the address is valid (starts with '0x' and is long enough)
  if (
    !address.startsWith("0x") ||
    address.length < startLength + endLength + 2
  ) {
    return address; // Return the original address if it's too short to collapse
  }

  // Extract the start and end parts of the address
  const start = address.substring(2, 2 + startLength);
  const end = address.substring(address.length - endLength);

  // Concatenate with ellipsis
  const collapsedAddress = `0x${start}...${end}`;

  return collapsedAddress;
};

/**
 * Cleans a JSON string by removing escape characters and extra quotes,
 * and parses it into a JavaScript object.
 * @param {string} jsonString - The JSON string to clean and parse.
 * @returns {object|null} The cleaned JavaScript object, or null if an error occurs.
 */
export const cleanJsonString = (jsonString: string) => {
  try {
    // Remove backslashes and extra quotes
    const cleanedString = jsonString.replace(/\\/g, "").replace(/^"|"$/g, "");
    // Parse the cleaned string into a JavaScript object
    const cleanedObject = JSON.parse(String(cleanedString));
    return cleanedObject;
  } catch (error) {
    console.error("Error cleaning JSON string:", error);
    return null; // or return an empty string, depending on your use case
  }
};
