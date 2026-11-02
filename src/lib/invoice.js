import { dateLabel, minutesToLabel, money } from "./format";

/** Builds and downloads a PDF receipt for a confirmed or completed booking. */
export async function downloadInvoice(b) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const orange = [255, 90, 31];
  const ink = [20, 20, 22];
  const muted = [92, 89, 98];
  const ref = `SS-${String(b._id).slice(-8).toUpperCase()}`;

  doc.setFillColor(...ink);
  doc.rect(0, 0, W, 110, "F");
  doc.setFillColor(...orange);
  doc.roundedRect(48, 36, 38, 38, 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("StudioSpace", 98, 62);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Booking receipt", W - 48, 52, { align: "right" });
  doc.text(ref, W - 48, 68, { align: "right" });

  let y = 160;
  doc.setTextColor(...ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(b.studioTitle, 48, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...muted);
  doc.text(b.studioLocation || "", 48, (y += 18));

  const rows = [
    ["Status", b.status],
    ["Booked by", `${b.userName} (${b.userEmail})`],
    ["Host", `${b.hostName || "Host"} (${b.hostEmail})`],
    ["Date", dateLabel(b.date)],
    ["Time", `${minutesToLabel(b.startMin)} – ${minutesToLabel(b.endMin)} (${b.hours} h)`],
    ["Issued", new Date().toLocaleDateString("en-US", { dateStyle: "medium" })],
  ];
  y += 34;
  doc.setFontSize(11);
  rows.forEach(([k, v]) => {
    doc.setTextColor(...muted);
    doc.text(k, 48, y);
    doc.setTextColor(...ink);
    doc.text(String(v), 170, y);
    y += 22;
  });

  y += 14;
  doc.setDrawColor(220, 215, 204);
  doc.line(48, y, W - 48, y);
  y += 28;
  const line = (label, value, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 14 : 11);
    doc.setTextColor(...(bold ? ink : muted));
    doc.text(label, 48, y);
    doc.setTextColor(...ink);
    doc.text(value, W - 48, y, { align: "right" });
    y += bold ? 28 : 22;
  };
  line(`${money(b.hourlyRate)} × ${b.hours} hours`, money(b.subtotal));
  line("Security deposit (refundable)", money(b.securityDeposit));
  doc.line(48, y - 8, W - 48, y - 8);
  y += 8;
  line("Total", money(b.total), true);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("Thank you for booking with StudioSpace. Keep this receipt for your records.", 48, 790);

  doc.save(`StudioSpace-receipt-${ref}.pdf`);
}
