import { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { usersListColumns } from '../../utils/columns';

export default function UsersList() {
  const [data, setData] = useState([]);
    useEffect(() => {
      const fetch = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/v1/get-all-customers');
          setData(response.data);
          
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
      fetch();
    }, []);
  
    if (data === null) {
      return <div>Loading...</div>;
    }
 
    const getRowId = (row) => `${row.publishDate}-${row.createdAt}`;
  

    return (
      <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={usersListColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={getRowId}
  
        />
      </div>
      </>
    );
  }
  
