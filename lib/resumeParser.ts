/**
 * Extracts plain text from an uploaded resume file, entirely in the
 * browser (nothing is uploaded to a server, which keeps this fast and
 * avoids sending resume content anywhere beyond the user's own device
 * until they choose to submit their result).
 *
 * Supports: .txt (native), .docx (via mammoth), .pdf (via pdfjs-dist).
 * Both libraries are loaded with dynamic import so the ~2MB pdf.js
 * bundle only downloads when someone actually uploads a PDF.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.txt')) {
    return await file.text();
  }

  if (name.endsWith('.docx')) {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (name.endsWith('.pdf')) {
    const pdfjsLib = await import('pdfjs-dist');
    // Worker served from the CDN matching the pinned pdfjs-dist version.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n';
    }
    return text;
  }

  throw new Error('Unsupported file type. Upload a .pdf, .docx or .txt file, or paste your resume text instead.');
}

export const ACCEPTED_RESUME_EXTENSIONS = '.pdf,.docx,.txt';
export const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
