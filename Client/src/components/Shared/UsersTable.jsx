import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { usersListColumns } from "../../utils/columns";

function UsersTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-matched-users-and-customers-reports"
        );
        const data = response.data;

        const flattenedData = data
          .map((item) => {
            return item.customer_reports.map((report) => {
              return {
                ...report,
              };
            });
          })
          .flat(); // Flatten the array of arrays

        setUsers(flattenedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchUsers();
  }, []);

  if (users.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Please generate a report first
      </p>
    );
  }
  if (users === null) {
    return <div>Loading...</div>;
  }
  const getRowId = (row) => `${row.publishDate}-${row.createdAt}-${row.customerId}`;

  return (
    <DataGrid
      rows={users}
      columns={usersListColumns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection
      getRowId={getRowId}
    />
  );
}

export default UsersTable;
