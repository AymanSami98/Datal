/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { getCustomerDataUrl } from "../../utils/endpoints";

function Churn() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [fullUserData, setFullUserData] = useState([]);
  useEffect(() => {
    if (users.length > 0) {
      setIsLoading(true);
      const fetchCustomerDataSequentially = async () => {
        const fullUserData = [];
        const customerData = [];

        for (const user of users) {
          try {
            const data = await axios.get(
              getCustomerDataUrl(user.id)
            );
            customerData.push(data);
            const fullUser = { userData: user, accesses: data[0] };
            fullUserData.push(fullUser);

            await new Promise((resolve) => setTimeout(resolve, 600));
          } catch (error) {
            console.error("Error fetching customer data:", error);
          }
        }
        setCustomerData(customerData);
        setFullUserData(fullUserData);
        setIsLoading(false);
      };
      fetchCustomerDataSequentially();
    }
  }, [users]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          setUsers(parsedData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleDownloadJSON = () => {
    const jsonData = JSON.stringify(fullUserData, null, 2);

    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "subscriber", headerName: "Subscriber", width: 150 },
    { field: "created_at", headerName: "Created At", width: 180 },
    {field: 'canceled_at', headerName: 'Canceled At', width: 180},
    { field: "product_id", headerName: "Product ID", width: 150 },
    { field: "product_type", headerName: "Product Type", width: 180 },
    { field: "with_manual_billing", headerName: "With Manual Billing", width: 200 },
  ];

  // Rows for the DataGrid
  const rows = fullUserData.map((data) => ({
    id: data.userData.id,
    name: data.userData.name,
    email: data.userData.email,
    subscriber: data.userData.subscriber ? "Yes" : "No",
    created_at: new Date(data.userData.created_at * 1000).toLocaleString(),
    product_id: data.accesses ? data.accesses.product_id : "N/A",
    product_type: data.accesses ? data.accesses.product_type : "N/A",
    with_manual_billing: data.accesses ? (data.accesses.with_manual_billing ? "Yes" : "No") : "N/A",
    canceled_at: data.accesses?.canceled_at
    ? new Date(data.accesses.canceled_at * 1000).toLocaleString()
    : "N/A",    // ... other fields you might want to include
  }));
  console.log(fullUserData);
  return (
    <div style={{ height: 400, width: "100%" }}>
    <input type="file" accept=".json" onChange={handleFileChange} />

    {isLoading && <p>Loading...</p>}
    <button className="download-button" onClick={handleDownloadJSON}>
            Download JSON
          </button>


    {fullUserData.length > 0 ? (
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />
      </div>
    ) : (
      <p>No customer data available.</p>
    )}
  </div>
  );
}

export default Churn;
