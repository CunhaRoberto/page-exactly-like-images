import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export async function createProposalPdf(sheet: HTMLElement): Promise<Blob> {
  await document.fonts.ready;
  await Promise.all(Array.from(sheet.querySelectorAll('img')).map(async (image) => {
    try { await image.decode(); } catch { /* Unavailable photos must not block the proposal. */ }
  }));
  const canvas = await html2canvas(sheet, {
    scale: 2,
    useCORS: true,
    backgroundColor: getComputedStyle(sheet).backgroundColor,
    windowWidth: 1280,
    onclone: (_document, element) => {
      element.style.width = '760px';
      element.style.maxWidth = 'none';
      element.style.borderRadius = '0';
      element.style.boxShadow = 'none';
      element.querySelectorAll('[data-pdf-exclude]').forEach((item) => item.remove());
      // Expand client and location details instead of clipping long names.
      element.querySelectorAll<HTMLElement>('.truncate').forEach((item) => {
        item.style.whiteSpace = 'normal';
        item.style.overflow = 'visible';
      });
    },
  });
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 12;
  const scale = Math.min((210 - margin * 2) / canvas.width, (297 - margin * 2) / canvas.height);
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, canvas.width * scale, canvas.height * scale);
  pdf.setProperties({ title: 'Proposta comercial — Memory Cream', creator: 'Memory Cream' });
  return pdf.output('blob');
}

export function downloadProposalPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}