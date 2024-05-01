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

export const saveUserReportsStats = async (userReportsStats) => {
  try {
    const maxId = await CustomersReport.max('id'); // Get the maximum ID currently in the table
    let id = maxId ? maxId + 1 : 1; // Start from the maximum ID + 1 or 1 if no records exist
    for (const [userId, { uniqueViews, sessionsCount, sessionsTime }] of Object.entries(userReportsStats)) {
      try {
        await CustomersReport.upsert({
          id,
          customerId: userId.replace(/,/g, ''), // Remove commas from userId
          uniqueViews: uniqueViews.size,
          reportId: 3,
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

export const saveContentReportsData = async (contentReports) => {
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
          reportId: 3,
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

  jsonData.forEach(({ view_start, Duration }) => {
    // Directly extract the date part from the ViewStart string
    const dateKey = new Date(view_start).toISOString().substring(0, 10); // Format date as YYYY-MM-DD
    const viewHour = new Date(view_start).getUTCHours();

    // Initialize or update total duration for the date
    if (!dailyDurations[dateKey]) {
      dailyDurations[dateKey] = { totalDuration: 0, primetime: null };
      hourlyViewCounts[dateKey] = new Array(24).fill(0);
    }
    dailyDurations[dateKey].totalDuration += typeof Duration === 'string' ? parseInt(Duration.replace(/,/g, '')) : Duration; // Handle Duration as string or number

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
        primeTime: primetime
      });
    } catch (error) {
      console.error(`Error saving daily duration for date ${date}: ${error}`);
    }
  }
};

export const saveReport = async (reportData) => {
//reportData.usersCount size
console.log(reportData.usersCount.size, 'reportData.usersCount.size');
  const usersCount = parseInt(reportData.usersCount.size);

  const rollingAverage = (reportData.sessionsTime / reportData.sessionsCount).toFixed(2);
 
  try {
    await Report.upsert({
      date: new Date().toISOString().substring(0, 10),
      uniqueViews: reportData.uniqueViews,
      sessionsCount: reportData.sessionsCount,
      sessionsTime: reportData.sessionsTime,
      rollingAverage: parseFloat(rollingAverage), // Convert rollingAverage to a number
      usersCount
    });
    console.log('Report data saved successfully');
  } catch (error) {
    console.error(`Error saving report data: ${error}`);
  }
}

