//uploadDataService.js
import { Customer, Content, DailyData, ContentReports, CustomersReport, Report } from '../database/index.js';

export const saveCustomerData = async (userStats) => {
  for (const [userId, { uniqueViews, sessionsCount, sessionsTime }] of Object.entries(userStats)) {
    try {
      await Customer.upsert({
        id: userId.replace(/,/g, ''), // Remove commas from userId
        uniqueViews: uniqueViews.size,
        sessionsCount,
        averageTime: sessionsTime / sessionsCount || 0,
        sessionsTime,
        accountType: 'user'
      });
    } catch (error) {
      console.error(`Error saving customer data for user ${userId}: ${error}`);
    }
  }
};

export const saveUserReportsStats = async (userReportsStats,reportId) => {
  try {
    const maxId = await CustomersReport.max('id'); // Get the maximum ID currently in the table
    let id = maxId ? maxId + 1 : 1; // Start from the maximum ID + 1 or 1 if no records exist
    for (const [userId, { uniqueViews, sessionsCount, sessionsTime }] of Object.entries(userReportsStats)) {
      try {
        await CustomersReport.upsert({
          id,
          customerId: userId.replace(/,/g, ''), // Remove commas from userId
          uniqueViews: uniqueViews.size,
          reportId,
          sessionsCount,
          averageTime: sessionsCount ? sessionsTime / sessionsCount : 0,
          sessionsTime,
          accountType: 'user'
        });
        id++; // Increment id for the next iteration
      } catch (error) {
        console.error(`Error saving customer data for user ${userId}: ${error}`);
      }
    }
  } catch (error) {
    console.error(`Error fetching maximum ID from CustomersReport: ${error}`);
  }
};


export const saveContentData = async (contentStats) => {
  for (const [contentId, stats] of Object.entries(contentStats)) {
    try {
      await Content.upsert({
        id: contentId.replace(/,/g, ''), // Remove commas from contentId
        ...stats,
        usersCount: stats.usersCount.size,
        // additional fields can be added here
      });
    } catch (error) {
      console.error(`Error saving content data for content ${contentId}: ${error}`);
    }
  }
};

export const saveContentReportsData = async (contentReports,reportId) => {
  try {
    const maxId = await ContentReports.max('id'); // Get the maximum ID currently in the table
    let id = maxId ? maxId + 1 : 1;
    // const lastReport = await Report.findOne({
    //   order: [['reportId', 'DESC']]
    // });
    // const lastReportId = lastReport ? lastReport.reportId : 1;
    for (const [contentId, stats] of Object.entries(contentReports)) {
      try {
        await ContentReports.upsert({
          id,
          contentId: contentId.replace(/,/g, ''), // Remove commas from contentId
          reportId,
          ...stats,
          usersCount: stats.usersCount.size,
        });
        id++; // Increment id for the next iteration
      } catch (error) {
        console.error(`Error saving content data for content ${contentId}: ${error}`);
      }
    }
  } catch (error) {
    console.error(`Error fetching maximum ID from ContentReports: ${error}`);
  }
};


export const saveDailyData = async (jsonData) => {
  const dailyDurations = {};
  const hourlyViewCounts = {};

  jsonData.forEach(({ view_start, duration }) => {
    // Directly extract the date part from the ViewStart string
    const dateKey = new Date(view_start).toISOString().substring(0, 10); // Format date as YYYY-MM-DD
    const viewHour = new Date(view_start).getUTCHours();

    // Initialize or update total duration for the date
    if (!dailyDurations[dateKey]) {
      dailyDurations[dateKey] = { totalDuration: 0, primetime: null };
      hourlyViewCounts[dateKey] = new Array(24).fill(0);
    }
    dailyDurations[dateKey].totalDuration += typeof duration === 'string' ? parseInt(duration.replace(/,/g, '')) : duration; // Handle Duration as string or number

    // Count views for each hour in UTC
    hourlyViewCounts[dateKey][viewHour]++;
  });

  // Determine primetime for each date
  for (const [dateKey, hours] of Object.entries(hourlyViewCounts)) {
    const maxViews = Math.max(...hours);
    const primetimeHour = hours.indexOf(maxViews);
    dailyDurations[dateKey].primetime = `${primetimeHour}:00`;
  }

  // Store in database
  for (const [date, { totalDuration, primetime }] of Object.entries(dailyDurations)) {
    try {
      await DailyData.upsert({
        date,
        totalDuration,
        primeTime: primetime,
        totalPlays: hourlyViewCounts[date].reduce((a, b) => a + b, 0)
      });
    } catch (error) {
      console.error(`Error saving daily duration for date ${date}: ${error}`);
    }
  }
};
const calculateRollingAverage = async (reportData) => {
  try {
    // Fetch all reports from the database
    const allReports = await Report.findAll();

    // Calculate the total sessions time in minutes including the sessions time of the current report
    let totalSessionsTime = reportData.sessionsTime / 60;
    allReports.forEach(report => {
      totalSessionsTime += report.sessionsTime / 60;
    });

    // Calculate the rolling average
    const rollingAverage = totalSessionsTime / (allReports.length + 1); // Adding 1 to include the current report

    return rollingAverage;
  } catch (error) {
    console.error(`Error calculating rolling average: ${error}`);
    throw error;
  }
};



export const saveReport = async (reportData) => {
  const usersCount = parseInt(reportData.usersCount.size);
  const rollingAverage = await calculateRollingAverage(reportData);

  try {
    const result = await Report.upsert({
      date: new Date().toISOString().substring(0, 10),
      uniqueViews: reportData.uniqueViews,
      sessionsCount: reportData.sessionsCount,
      sessionsTime: reportData.sessionsTime,
      rollingAverage: rollingAverage.toFixed(2),
      usersCount
    });

    console.log('Report data saved successfully');

    let reportId = null;

    if (result) {
      // Check if the result is an array with upserted data
      if (Array.isArray(result)) {
        // If it contains the upserted data, extract the report ID
        const [upsertedData] = result;
        reportId = upsertedData.id;
      } else {
        // If it doesn't contain the upserted data, assume the report was updated
        reportId = result.id;
      }
    }

    return reportId;
  } catch (error) {
    console.error(`Error saving report data: ${error}`);
    throw error;
  }
};
