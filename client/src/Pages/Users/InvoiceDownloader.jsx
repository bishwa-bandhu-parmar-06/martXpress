import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Ensure this path is correct for your project structure
import MyLogo from "/MartXpresslogo.png";

const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };

    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

export const InvoiceDownloader = ({ order }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      // A4 format is default: 210mm x 297mm
      const doc = new jsPDF("portrait", "mm", "a4");
      const pageWidth = doc.internal.pageSize.width;

      // --- 1. HEADER: LOGO & INVOICE TITLE ---
      let logoData = null;
      try {
        logoData = await getBase64ImageFromURL(MyLogo);
      } catch (err) {
        console.error("Logo loading failed:", err);
      }

      if (logoData) {
        // (image, format, x, y, width, height)
        // Kept proportion wide and short so it doesn't stretch
        doc.addImage(logoData, "PNG", 14, 15, 45, 12);
      } else {
        doc.setFontSize(24);
        doc.setTextColor(37, 99, 235); // Primary Blue
        doc.setFont("helvetica", "bold");
        doc.text("martXpress", 14, 22);
      }

      // "INVOICE" Title on the top right
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", pageWidth - 14, 24, { align: "right" });

      // --- 2. ORDER META DATA (Right Aligned) ---
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);

      const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      doc.text(
        `Order ID: #${order._id.substring(0, 10).toUpperCase()}`,
        pageWidth - 14,
        34,
        { align: "right" },
      );
      doc.text(`Date: ${orderDate}`, pageWidth - 14, 40, { align: "right" });
      doc.text(`Payment Method: ${order.paymentMethod}`, pageWidth - 14, 46, {
        align: "right",
      });

      // --- 3. BILLING ADDRESS (Left Aligned) ---
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text("Billed To:", 14, 40);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      const addr = order.shippingAddress;
      doc.text(addr.fullName, 14, 46);
      doc.text(`${addr.house}, ${addr.street}`, 14, 51);
      doc.text(`${addr.city}, ${addr.state} - ${addr.pincode}`, 14, 56);
      doc.text(`Phone: ${addr.mobile}`, 14, 61);

      // --- 4. SEPARATOR LINE ---
      doc.setDrawColor(230, 230, 230);
      doc.line(14, 68, pageWidth - 14, 68);

      // --- 5. ITEMS TABLE ---
      // Swapped to 'INR' to prevent jsPDF from breaking the numbers
      const tableRows = order.items.map((item, index) => [
        index + 1,
        item.productId?.name || "Product Name Unavailable",
        item.quantity,
        `INR ${item.price.toLocaleString("en-IN")}`,
        `INR ${(item.price * item.quantity).toLocaleString("en-IN")}`,
      ]);

      autoTable(doc, {
        startY: 75,
        head: [["#", "Product Description", "Qty", "Unit Price", "Total"]],
        body: tableRows,
        theme: "grid", // Gives a crisp, clean border look
        headStyles: {
          fillColor: [37, 99, 235], // Primary Blue
          textColor: 255,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9.5,
          cellPadding: 5,
          textColor: [60, 60, 60],
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // Very light gray for alternate rows
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: "auto" }, // Let the name expand naturally
          2: { cellWidth: 15, halign: "center" },
          3: { cellWidth: 35, halign: "right" },
          4: { cellWidth: 35, halign: "right" },
        },
      });

      // --- 6. TOTALS SUMMARY ---
      const finalY = doc.lastAutoTable.finalY + 10;

      // Subtotal & Shipping logic (Assuming free shipping if not explicitly saved)
      const subtotal = order.totalAmount;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Subtotal:`, pageWidth - 55, finalY);
      doc.text(
        `INR ${subtotal.toLocaleString("en-IN")}`,
        pageWidth - 14,
        finalY,
        { align: "right" },
      );

      doc.text(`Shipping:`, pageWidth - 55, finalY + 6);
      doc.text(`INR 0.00`, pageWidth - 14, finalY + 6, { align: "right" });

      // Grand Total Line
      doc.setDrawColor(200, 200, 200);
      doc.line(pageWidth - 60, finalY + 10, pageWidth - 14, finalY + 10);

      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text(`Grand Total:`, pageWidth - 55, finalY + 17);
      doc.setTextColor(37, 99, 235); // Blue highlight for total
      doc.text(
        `INR ${order.totalAmount.toLocaleString("en-IN")}`,
        pageWidth - 14,
        finalY + 17,
        { align: "right" },
      );

      // --- 7. FOOTER ---
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");

      doc.text(
        "This is a computer-generated invoice and does not require a physical signature.",
        pageWidth / 2,
        pageHeight - 15,
        { align: "center" },
      );
      doc.text(
        "Thank you for shopping with martXpress!",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" },
      );

      // Save the PDF
      doc.save(`Invoice_martXpress_${order._id.substring(0, 8)}.pdf`);
      toast.success("Invoice downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70 text-sm"
    >
      {isGenerating ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Download size={18} />
      )}
      {isGenerating ? "Generating..." : "Download Invoice"}
    </button>
  );
};
