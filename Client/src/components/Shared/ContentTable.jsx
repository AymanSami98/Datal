import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

import { contentsListColumns } from "../../utils/columns";

export default function ContentTable() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-matched-content-and-content-reports"
        );
        const data = response.data;

        const flattenedData = data
          .map((item) => {
            return item.content_reports.map((report) => {
              return {
                ...report,
                title: item.title,
                duration: item.duration,
                publishDate: item.publishDate,
              };
            });
          })
          .flat(); // Flatten the array of arrays

          setContents(flattenedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetch();
  }, []);

  if (contents.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Please generate a report first
      </p>
    );
  }

  if (contents === null) {
    return <div>Loading...</div>;
  }

  const getRowId = (row) => {
    const id = `${row.title}-${row.createdAt}`;
    return id;
  };
  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={contents}
          columns={contentsListColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={getRowId}
        />
 
      </div>
    </>
  );
}
