const contentsListColumns = [
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

const usersListColumns = [
    { field: 'id', headerName: 'ID', width: 110 },
    { field: 'uniqueViews', headerName: 'Unique Views', width: 130 },
    { field: 'sessionsCount', headerName: 'Sessions Count', width: 120 },
    { field: 'sessionsTime', headerName: 'Sessions Time', width: 110 },
    { field: 'averageTime', headerName: 'Average Time', width: 110 },
    { field: 'accountType', headerName: 'Account Type', width: 110 },
   ];


   const dailyColumns = [
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'totalDuration', headerName: 'Total Duration', width: 130 },
    { field: 'primeTime', headerName: 'Prime Time', width: 110 },
  ];

export { contentsListColumns, usersListColumns,dailyColumns };