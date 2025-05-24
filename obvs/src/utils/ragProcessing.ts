import pdf from "pdf-parse/lib/pdf-parse";
import { unified } from "unified";
import remarkParse from "remark-parse";
import * as cheerio from "cheerio";
import { VFile } from "vfile"; // Import VFile for type safety with unified

export async function extractTextFromFile(
  filePath: string,
  filetype: "pdf" | "md" | "html" | "txt"
): Promise<string> {
  const fs = await import("fs/promises");
  const buffer: Buffer = await fs.readFile(filePath);

  if (filetype === "pdf") {
    const data = await pdf(buffer);
    return data.text;
  }
  if (filetype === "md") {
    const text: string = buffer.toString("utf-8");
    // Process the markdown content. Unified works with VFiles.
    const file = unified().use(remarkParse).parse(text) as any; // Cast to any to access children
    // Extract text content from the AST. This is a simplified example.
    // You might need a more sophisticated way to extract text depending on the markdown structure.
    let extractedText = "";
    if (file.children && Array.isArray(file.children)) {
      file.children.forEach((node: any) => {
        if (node.type === "text" && node.value) {
          extractedText += node.value + " ";
        } else if (node.children && Array.isArray(node.children)) {
          // Recursively process children if they exist (e.g., for paragraphs, headings)
          node.children.forEach((childNode: any) => {
            if (childNode.type === "text" && childNode.value) {
              extractedText += childNode.value + " ";
            }
          });
        }
      });
    }
    return extractedText.trim();
  }
  if (filetype === "html") {
    const html: string = buffer.toString("utf-8");
    const $: cheerio.CheerioAPI = cheerio.load(html);
    return $("body").text();
  }
  if (filetype === "txt") {
    return buffer.toString("utf-8");
  }
  // Typescript should prevent this, but as a safeguard:
  throw new Error("Unsupported file type: " + filetype);
}
