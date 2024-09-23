import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "./Report.css"; // Import CSS file for styling

const Report = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

  const generateReport = async () => {
    let apiUrl;

    switch (selectedReport) {
      case "clients":
        apiUrl = `https://backend.piyushshivkumarshhri.com/api/clients/bymonth/${startMonth}/${endMonth}`;
        break;
      case "cases":
        apiUrl = `https://backend.piyushshivkumarshhri.com/api/cases/bymonth/${startMonth}/${endMonth}`;
        break;
      case "executives":
        apiUrl = `https://backend.piyushshivkumarshhri.com/api/executives/bymonth/${startMonth}/${endMonth}`;
        break;
      default:
        alert("Please select a report type.");
        return;
    }

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data || !data.data) {
        throw new Error("Invalid response structure");
      }

      const filteredData = data.data.map(
        ({ _id, password, otp, __v, ...rest }) => rest
      );

      if (fileType === "pdf") {
        generatePDF(filteredData);
      } else if (fileType === "xlsx") {
        generateExcel(filteredData);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    let tableColumn,
      tableRows = [];

    if (selectedReport === "cases") {
      tableColumn = [
        "Case Label",
        "Client",
        "Executive",
        "Issues",
        "Payment",
        "Contact Number",
        "Date",
        "Status",
      ];

      data.forEach((item) => {
        const itemData = [
          item.caseLabel,
          item.client,
          item.executive,
          item.issues,
          item.payment,
          item.contactNumber,
          new Date(item.date).toLocaleDateString(),
          item.status,
        ];
        tableRows.push(itemData);
      });
    } else if (selectedReport === "clients") {
      tableColumn = [
        "First Name",
        "Last Name",
        "Email",
        "Address",
        "City",
        "Phone Number",
        "Reference",
        "Date",
      ];

      data.forEach((item) => {
        const itemData = [
          item.firstName,
          item.lastName,
          item.email,
          item.address,
          item.city,
          item.phoneNumber,
          item.refrance,
          new Date(item.date).toLocaleDateString(),
        ];
        tableRows.push(itemData);
      });
    } else if (selectedReport === "executives") {
      tableColumn = [
        "First Name",
        "Last Name",
        "Email",
        "Phone Number",
        "Address",
        "City",
        "Date",
      ];

      data.forEach((item) => {
        const itemData = [
          item.firstName,
          item.lastName,
          item.email,
          item.phoneNumber,
          item.address,
          item.city,
          new Date(item.date).toLocaleDateString(),
        ];
        tableRows.push(itemData);
      });
    }

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`${selectedReport}_report.pdf`);
  };

  const generateExcel = (data) => {
    let worksheet,
      workbook = XLSX.utils.book_new();

    if (selectedReport === "cases") {
      worksheet = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          CaseLabel: item.caseLabel,
          Client: item.client,
          Executive: item.executive,
          Issues: item.issues,
          Payment: item.payment,
          ContactNumber: item.contactNumber,
          Date: new Date(item.date).toLocaleDateString(),
          Status: item.status,
        }))
      );
    } else if (selectedReport === "clients") {
      worksheet = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          FirstName: item.firstName,
          LastName: item.lastName,
          Email: item.email,
          Address: item.address,
          City: item.city,
          PhoneNumber: item.phoneNumber,
          Reference: item.refrance,
          Date: new Date(item.date).toLocaleDateString(),
        }))
      );
    } else if (selectedReport === "executives") {
      worksheet = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          FirstName: item.firstName,
          LastName: item.lastName,
          Email: item.email,
          PhoneNumber: item.phoneNumber,
          Address: item.address,
          City: item.city,
          Date: new Date(item.date).toLocaleDateString(),
        }))
      );
    }

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)
    );
    XLSX.writeFile(workbook, `${selectedReport}_report.xlsx`);
  };

  return (
    <div className="report-container">
      <h1 style={{ textAlign: "center" }}>Vastu </h1>
      <div className="form-group">
        <label>Select Report</label>
        <select
          onChange={(e) => setSelectedReport(e.target.value)}
          className="select-input"
        >
          <option value="">Select Report</option>
          <option value="clients">Client Report</option>
          <option value="cases">Case Report</option>
          <option value="executives">Executive Report</option>
        </select>
      </div>
      <div className="form-group">
        <label>Start Month</label>
        <select
          value={startMonth}
          onChange={(e) => setStartMonth(e.target.value)}
          className="select-input"
        >
          <option value="">Select Month</option>
          {[...Array(12).keys()].map((month) => (
            <option key={month} value={month + 1}>
              {new Date(0, month).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>End Month</label>
        <select
          value={endMonth}
          onChange={(e) => setEndMonth(e.target.value)}
          className="select-input"
        >
          <option value="">Select Month</option>
          {[...Array(12).keys()].map((month) => (
            <option key={month} value={month + 1}>
              {new Date(0, month).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>File Type</label>
        <select
          onChange={(e) => setFileType(e.target.value)}
          className="select-input"
        >
          <option value="pdf">PDF</option>
          <option value="xlsx">Excel</option>
        </select>
      </div>
      <div>
        <button onClick={generateReport} className="daownload-report">
          Download Report
        </button>
      </div>
    </div>
  );
};

export default Report;
