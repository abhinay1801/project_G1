import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = ({ refresh }) => {
  const [data, setData] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedQuarters, setSelectedQuarters] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (refresh) {
      axios
        .get("http://localhost:5000/data")
        .then((response) => {
          const filteredData = response.data.map(
            ({ _id, __v, ...rest }) => rest
          );
          setData(filteredData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [refresh]);

  // Extract year from date string
  const extractYear = (dateString) => {
    if (!dateString) return null;

    // Try to extract a 4-digit year from the string
    const yearMatch = dateString.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      return yearMatch[1];
    }

    // If no year found, return null
    return null;
  };

  // Extract month from date string using Date object
  const extractMonth = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date) ? null : date.getMonth() + 1;
  };

  // Get quarter from month number
  const getQuarter = (month) => {
    if (month >= 1 && month <= 3) return "Q1";
    if (month >= 4 && month <= 6) return "Q2";
    if (month >= 7 && month <= 9) return "Q3";
    if (month >= 10 && month <= 12) return "Q4";
    return null;
  };

  // Extract quarter from date string
  const extractQuarter = (dateString) => {
    const month = extractMonth(dateString);
    return month ? getQuarter(month) : null;
  };

  const uniqueProjects = [
    ...new Set(data.map((item) => item["Project_Short_Text"]).filter(Boolean)),
  ];

  const uniqueCustomers = [
    ...new Set(data.map((item) => item["Customer_Short_Text"]).filter(Boolean)),
  ];

  // Extract unique years from delivery dates
  const uniqueYears = [
    ...new Set(
      data
        .map((item) => extractYear(item["Original_Delivery_Date"]))
        .filter(Boolean)
    ),
  ].sort();

  // Define quarters
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  const handleProjectClick = (project) => {
    setSelectedCustomers([]);
    setSelectedYears([]);
    setSelectedQuarters([]);
    setSelectedProjects((prevProjects) =>
      prevProjects.includes(project)
        ? prevProjects.filter((p) => p !== project)
        : [...prevProjects, project]
    );
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomers((prevCustomers) =>
      prevCustomers.includes(customer)
        ? prevCustomers.filter((c) => c !== customer)
        : [...prevCustomers, customer]
    );
  };

  const handleYearClick = (year) => {
    setSelectedYears((prevYears) =>
      prevYears.includes(year)
        ? prevYears.filter((y) => y !== year)
        : [...prevYears, year]
    );
  };

  const handleQuarterClick = (quarter) => {
    setSelectedQuarters((prevQuarters) =>
      prevQuarters.includes(quarter)
        ? prevQuarters.filter((q) => q !== quarter)
        : [...prevQuarters, quarter]
    );
  };

  useEffect(() => {
    let newFilteredData = data;

    if (selectedProjects.length > 0) {
      newFilteredData = newFilteredData.filter((item) =>
        selectedProjects.includes(item["Project_Short_Text"])
      );
    }

    if (selectedCustomers.length > 0) {
      newFilteredData = newFilteredData.filter((item) =>
        selectedCustomers.includes(item["Customer_Short_Text"])
      );
    }

    if (selectedYears.length > 0) {
      newFilteredData = newFilteredData.filter((item) => {
        const year = extractYear(item["Original_Delivery_Date"]);
        return year && selectedYears.includes(year);
      });
    }

    if (selectedQuarters.length > 0) {
      newFilteredData = newFilteredData.filter((item) => {
        const quarter = extractQuarter(item["Original_Delivery_Date"]);
        return quarter && selectedQuarters.includes(quarter);
      });
    }

    setFilteredData(newFilteredData);
  }, [
    selectedProjects,
    selectedCustomers,
    selectedYears,
    selectedQuarters,
    data,
  ]);

  // Reorganize the data structure to better handle multiple quarters
  const groupedData = {};

  filteredData.forEach((item) => {
    const projectName = item["Project_Short_Text"] || "Unnamed Project";
    const customerName = item["Customer_Short_Text"] || "N/A";
    const materialType =
      item["Material_Price_Type"] || item["Material_Type"] || "Misc";
    const itemPrice = parseFloat(item["Ordered_Value"]?.$numberDecimal || 0);
    const originalDeliveryDate =
      item["Original_Delivery_Date"] || "Not scheduled";
    const deliveryYear = extractYear(originalDeliveryDate) || "Unknown Year";
    const deliveryQuarter =
      extractQuarter(originalDeliveryDate) || "Unknown Quarter";

    // Create unique key for this project + customer + quarter combination
    const key = `${projectName}|${customerName}|${deliveryQuarter}`;

    if (!groupedData[key]) {
      groupedData[key] = {
        projectName,
        customerName,
        "Material Price Type": 0,
        Spares: 0,
        System: 0,
        Services: 0,
        Misc: 0,
        Grand_Total: 0,
        Original_Delivery_Date: originalDeliveryDate,
        Delivery_Year: deliveryYear,
        Delivery_Quarter: deliveryQuarter,
      };
    }

    const lowerType = materialType.toLowerCase();

    if (lowerType === "spares") {
      groupedData[key]["Spares"] += itemPrice;
    } else if (lowerType === "system") {
      groupedData[key]["System"] += itemPrice;
    } else if (lowerType === "services") {
      groupedData[key]["Services"] += itemPrice;
    } else {
      groupedData[key]["Misc"] += itemPrice;
    }

    groupedData[key]["Grand_Total"] += itemPrice;

    if (item["Original_Delivery_Date"]) {
      groupedData[key]["Original_Delivery_Date"] =
        item["Original_Delivery_Date"];
    }
  });

  // Convert the groupedData object to an array for rendering
  const groupedDataArray = Object.values(groupedData);

  // Group entries by project for the table display
  const projectGroups = {};
  groupedDataArray.forEach((item) => {
    if (!projectGroups[item.projectName]) {
      projectGroups[item.projectName] = [];
    }
    projectGroups[item.projectName].push(item);
  });

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div>
        <h2 style={{ marginBottom: "10px" }}>Projects</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "10px",
          }}
        >
          {uniqueProjects.map((project, index) => (
            <button
              key={index}
              onClick={() => handleProjectClick(project)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: selectedProjects.includes(project)
                  ? "#0056b3"
                  : "#007bff",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              {project}
            </button>
          ))}
        </div>
      </div>

      {selectedProjects.length > 0 && (
        <div>
          <h2 style={{ marginBottom: "10px" }}>Customers</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
            }}
          >
            {uniqueCustomers.map((customer, index) => (
              <button
                key={index}
                onClick={() => handleCustomerClick(customer)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: selectedCustomers.includes(customer)
                    ? "#0056b3"
                    : "#007bff",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {customer}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedProjects.length > 0 && uniqueYears.length > 0 && (
        <div>
          <h2 style={{ marginBottom: "10px" }}>Delivery Years</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "10px",
            }}
          >
            {uniqueYears.map((year, index) => (
              <button
                key={index}
                onClick={() => handleYearClick(year)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: selectedYears.includes(year)
                    ? "#0056b3"
                    : "#007bff",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedProjects.length > 0 && (
        <div>
          <h2 style={{ marginBottom: "10px" }}>Quarters</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
            }}
          >
            {quarters.map((quarter, index) => (
              <button
                key={index}
                onClick={() => handleQuarterClick(quarter)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: selectedQuarters.includes(quarter)
                    ? "#0056b3"
                    : "#007bff",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {quarter}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedProjects.length > 0 && Object.keys(projectGroups).length > 0 && (
        <div>
          <h2 style={{ marginBottom: "10px" }}>Filtered Data</h2>
          <table
            border="1"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              background: "#1E1E1E",
              color: "#fff",
            }}
          >
            <thead>
              <tr style={{ background: "#333" }}>
                <th>Project</th>
                <th>Customer</th>
                <th>Spares</th>
                <th>System</th>
                <th>Services</th>
                <th>Misc</th>
                <th>Grand Total</th>
                <th>Original Delivery Date</th>
                <th>Quarter</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(projectGroups).map((projectName, projectIndex) => {
                const projectItems = projectGroups[projectName];
                return projectItems.map((item, itemIndex) => (
                  <tr key={`${projectIndex}-${itemIndex}`}>
                    {itemIndex === 0 && (
                      <td
                        rowSpan={projectItems.length}
                        style={{
                          fontWeight: "bold",
                          background: "#444",
                          color: "#fff",
                          padding: "10px",
                          border: "1px solid #fff",
                        }}
                      >
                        {projectName}
                      </td>
                    )}
                    <td>{item.customerName}</td>
                    <td>{item["Spares"].toFixed(2)}</td>
                    <td>{item["System"].toFixed(2)}</td>
                    <td>{item["Services"].toFixed(2)}</td>
                    <td>{item["Misc"].toFixed(2)}</td>
                    <td>{item["Grand_Total"].toFixed(2)}</td>
                    <td>{item["Original_Delivery_Date"]}</td>
                    <td>{item["Delivery_Quarter"]}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;