import mammoth from "mammoth";
import type { ImageData } from "../types";

export interface ParsedFile {
  fileName: string;
  text: string;
  images?: ImageData[];  // NEW: Images extracted from DOCX files
}

const SUPPORTED_EXTENSIONS = [".txt", ".docx"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_TEXT_LENGTH = 15000;

export function isSupportedFile(file: File): boolean {
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  return SUPPORTED_EXTENSIONS.includes(ext);
}

export async function parseFile(file: File): Promise<ParsedFile> {
  if (!isSupportedFile(file)) {
    throw new Error(`Unsupported file type. Please upload ${SUPPORTED_EXTENSIONS.join(" or ")} files.`);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large. Please upload a file under 5 MB.");
  }

  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

  let text: string;
  let images: ImageData[] | undefined;

  if (ext === ".txt") {
    text = await readTextFile(file);
  } else if (ext === ".docx") {
    const docxResult = await readDocxFile(file);
    text = docxResult.text;
    images = docxResult.images;
  } else {
    throw new Error("Unsupported file type.");
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("The file appears to be empty.");
  }

  if (trimmed.length > MAX_TEXT_LENGTH) {
    return {
      fileName: file.name,
      text: trimmed.substring(0, MAX_TEXT_LENGTH) + "\n\n[Content truncated due to length]",
      images
    };
  }

  return { fileName: file.name, text: trimmed, images };
}

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read text file."));
    reader.readAsText(file);
  });
}

async function readDocxFile(file: File): Promise<{ text: string; images?: ImageData[] }> {
  const arrayBuffer = await file.arrayBuffer();

  // Extract text
  const textResult = await mammoth.extractRawText({ arrayBuffer });
  const text = textResult.value;

  // Extract images
  const images: ImageData[] = [];

  try {
    const htmlResult = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          try {
            const buffer = await image.read();
            const base64 = btoa(
              new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            images.push({
              fileName: `${file.name}-image-${images.length + 1}`,
              mimeType: image.contentType || "image/png",
              base64: base64,
            });

            return {
              src: `data:${image.contentType};base64,${base64}`,
            };
          } catch (err) {
            console.warn("Failed to extract image:", err);
            return { src: "" };
          }
        }),
      }
    );

    // If no images found through HTML conversion, return undefined
    if (images.length === 0) {
      return { text };
    }

    return { text, images };
  } catch (err) {
    console.warn("Failed to extract images from DOCX:", err);
    return { text };
  }
}
