import { Injectable } from '@angular/core';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Comprobante } from './comprobantes.service';

@Injectable({
  providedIn: 'root'
})
export class ComprobantePdfService {
  async generarPdf(comprobante: Comprobante): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();

    const margin = 48;
    let y = height - margin;

    const drawText = (text: string, size: number, bold = false, color = rgb(0.1, 0.1, 0.1)) => {
      page.drawText(text, {
        x: margin,
        y,
        size,
        font: bold ? fontBold : font,
        color
      });
      y -= size + 10;
    };

    // Header
    drawText('APUTOURS - COMPROBANTE DE PAGO', 18, true, rgb(0.1, 0.2, 0.4));
    y -= 6;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.75, 0.8, 0.85)
    });
    y -= 18;

    // Identificadores
    drawText(`Codigo comprobante: ${comprobante.codigoComprobante}`, 12, true);
    drawText(`Codigo verificacion: ${comprobante.codigoVerificacion}`, 12, true, rgb(0.1, 0.35, 0.2));
    drawText(`Fecha emision: ${this.formatDate(comprobante.$createdAt)}`, 11);

    y -= 8;
    drawText('DATOS DEL CLIENTE', 12, true, rgb(0.2, 0.2, 0.2));
    drawText(`Nombre: ${comprobante.clienteNombre}`, 11);
    drawText(`Email: ${comprobante.clienteEmail}`, 11);
    drawText(`Documento: ${comprobante.clienteDocumento}`, 11);
    drawText(`Telefono: ${comprobante.clienteTelefono}`, 11);

    y -= 8;
    drawText('DETALLE DEL SERVICIO', 12, true, rgb(0.2, 0.2, 0.2));
    drawText(`Proveedor: ${comprobante.proveedorNombre}`, 11);
    drawText(`Tipo: ${comprobante.tipoServicio}`, 11);
    drawText(`Descripcion: ${this.trunc(comprobante.descripcionServicio, 90)}`, 11);
    drawText(`Fecha servicio: ${this.formatDate(comprobante.fechaServicio)}`, 11);
    if (comprobante.fechaFinServicio) {
      drawText(`Fecha fin: ${this.formatDate(comprobante.fechaFinServicio)}`, 11);
    }
    drawText(`Personas: ${comprobante.cantidadPersonas}`, 11);
    drawText(`Metodo de pago: ${comprobante.metodoPago}`, 11);

    y -= 8;
    drawText('RESUMEN DE PAGO', 12, true, rgb(0.2, 0.2, 0.2));
    drawText(`Subtotal: S/ ${Number(comprobante.subtotal).toFixed(2)}`, 11);
    drawText(`IGV: S/ ${Number(comprobante.impuestos).toFixed(2)}`, 11);
    if (Number(comprobante.descuento) > 0) {
      drawText(`Descuento: -S/ ${Number(comprobante.descuento).toFixed(2)}`, 11);
    }
    drawText(`TOTAL: S/ ${Number(comprobante.total).toFixed(2)}`, 13, true);

    y -= 10;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.75, 0.8, 0.85)
    });
    y -= 18;

    // Footer
    page.drawText('Este documento fue generado por el sistema. El proveedor puede validar el codigo de verificacion en el portal.', {
      x: margin,
      y: Math.max(margin, y),
      size: 9,
      font,
      color: rgb(0.4, 0.45, 0.5)
    });

    return await pdfDoc.save();
  }

  async descargarComprobante(comprobante: Comprobante): Promise<void> {
    const bytes = await this.generarPdf(comprobante);
    const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${comprobante.codigoComprobante}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleString('es-PE');
  }

  private trunc(text: string, max: number): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
  }
}
