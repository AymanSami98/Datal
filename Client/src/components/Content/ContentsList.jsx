import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

export default function ContentsList() {
  const [data, setData] = useState([]);
    useEffect(() => {
      const fetch = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/v1/get-all-contents');
          setData(response.data);
          
        } catch (error) {
          console.error("Error fetching data: ", error);
          // Handle error appropriately
        }
      };
      fetch();
    }, []);
    console.log(data);
  
    // If data has not been fetched yet, display loading state
    if (data === null) {
      return <div>Loading...</div>;
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 110 },
        { field: 'duration', headerName: 'Duration', width: 130 },
        { field: 'title', headerName: 'Title', width: 110 },
        { field: 'publishDate', headerName: 'Publish Date', width: 110 },
        { field: 'sessionsTime', headerName: 'Sessions Time', width: 110 },
        { field: 'sessionsCount', headerName: 'Sessions Count', width: 110 },
        { field: 'usersCount', headerName: 'Users Count', width: 110 },
        { field: 'type', headerName: 'Type', width: 110 },
        { field: 'primeTime', headerName: 'Prime Time', width: 110 },
    ];
    const getRowId = (row) => `${row.publishDate}-${row.createdAt}`;
  

    return (
      <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={getRowId}
  
        />
      </div>
      </>
    );
  }
  
