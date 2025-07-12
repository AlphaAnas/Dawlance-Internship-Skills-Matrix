// Excel export utility function
export const exportToExcel = async (data: any[], filename: string) => {
  try {
    // Create CSV content
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Escape commas and quotes in cell values
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error("Export failed:", error)
    throw error
  }
}

// Alternative Excel export using XLSX library (if you want true Excel format)
export const exportToExcelXLSX = async (data: any[], filename: string) => {
  try {
    // This would require installing xlsx library: npm install xlsx
    // import * as XLSX from 'xlsx'

    // const worksheet = XLSX.utils.json_to_sheet(data)
    // const workbook = XLSX.utils.book_new()
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees')
    // XLSX.writeFile(workbook, `${filename}.xlsx`)

    // For now, fallback to CSV export
    return exportToExcel(data, filename)
  } catch (error) {
    console.error("Excel export failed:", error)
    throw error
  }
}
