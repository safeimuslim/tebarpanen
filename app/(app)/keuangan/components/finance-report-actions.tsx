"use client"

import { Printer, ReceiptText } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { FinanceReportRow } from "../queries"

export function FinanceReportActions({
  farmLabel,
  periodLabel,
  rows,
  summary,
}: {
  farmLabel: string
  periodLabel: string
  rows: FinanceReportRow[]
  summary: {
    depreciation: number
    netProfit: number
    operationalCost: number
    revenue: number
  }
}) {
  const openReportWindow = () => {
    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1080,height=720")

    if (!printWindow) {
      return
    }

    const tableRows = rows
      .map(
        (row) => `
          <tr>
            <td>${row.label}</td>
            <td class="num">${formatCurrency(row.revenue)}</td>
            <td class="num">${formatCurrency(row.operationalCost)}</td>
            <td class="num">${formatCurrency(row.depreciation)}</td>
            <td class="num">${formatCurrency(row.netProfit)}</td>
          </tr>
        `
      )
      .join("")

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Laba Rugi - ${periodLabel}</title>
          <style>
            body {
              font-family: Inter, Arial, sans-serif;
              color: #163042;
              margin: 32px;
            }
            h1, h2, p { margin: 0; }
            .header { margin-bottom: 24px; }
            .muted { color: #5f6b76; }
            .summary {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 12px;
              margin-bottom: 24px;
            }
            .card {
              border: 1px solid #d9e1e3;
              border-radius: 10px;
              padding: 12px 14px;
              background: #ffffff;
            }
            .label {
              font-size: 12px;
              color: #5f6b76;
              margin-bottom: 6px;
            }
            .value {
              font-size: 18px;
              font-weight: 700;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
            }
            th, td {
              border: 1px solid #d9e1e3;
              padding: 10px 12px;
              font-size: 13px;
            }
            th {
              text-align: left;
              background: #f4f8f8;
            }
            .num { text-align: right; }
            .note {
              margin-top: 16px;
              font-size: 12px;
              color: #5f6b76;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="muted">Laporan Laba Rugi</p>
            <h1>Keuangan Farm</h1>
            <p class="muted" style="margin-top: 8px;">Farm: ${farmLabel}</p>
            <p class="muted" style="margin-top: 4px;">Periode: ${periodLabel}</p>
          </div>

          <div class="summary">
            <div class="card">
              <div class="label">Pendapatan</div>
              <div class="value">${formatCurrency(summary.revenue)}</div>
            </div>
            <div class="card">
              <div class="label">Biaya Operasional</div>
              <div class="value">${formatCurrency(summary.operationalCost)}</div>
            </div>
            <div class="card">
              <div class="label">Penyusutan</div>
              <div class="value">${formatCurrency(summary.depreciation)}</div>
            </div>
            <div class="card">
              <div class="label">Laba / Rugi Bersih</div>
              <div class="value">${formatCurrency(summary.netProfit)}</div>
            </div>
          </div>

          <h2>Rincian Per Bulan</h2>
          <table>
            <thead>
              <tr>
                <th>Periode</th>
                <th class="num">Pendapatan</th>
                <th class="num">Biaya Operasional</th>
                <th class="num">Penyusutan</th>
                <th class="num">Laba / Rugi Bersih</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>

          <p class="note">
            Untuk menyimpan PDF, gunakan tujuan printer "Save as PDF" pada dialog cetak browser.
          </p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button className="gap-2" onClick={openReportWindow} type="button" variant="outline">
        <Printer className="size-4" />
        Cetak
      </Button>
      <Button className="gap-2" onClick={openReportWindow} type="button">
        <ReceiptText className="size-4" />
        Ekspor PDF
      </Button>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value)
}
