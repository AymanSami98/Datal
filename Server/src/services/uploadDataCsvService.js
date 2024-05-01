//uploadDataService.js
import { Customer, Content, DailyData, ContentReports, CustomersReport,Report } from '../database/index.js';
const lastReportId = Report.findOne({ order: [['id', 'DESC']] }).id;
const reportId = lastReportId + 1;
export const saveCustomerData = async (userStats) => {
  for (const [user_id, { uniqueViews, sessionsCount, sessionsTime }] of Object.entries(userStats)) {
    try {
      await Customer.upsert({
        id: user_id.replace(/,/g, ''), // Remove commas from userId
        uniqueViews: uniqueViews.size,
        sessionsCount,
        averageTime: sessionsCount > 0 ? sessionsTime / sessionsCount : 0, // Ensure sessionsCount is not 0 to avoid division by zero
        sessionsTime,
        accountType: 'user'
      });
    } catch (error) {
      console.error(`Error saving customer data for user ${user_id}: ${error}`);
    }
  }
};


export const saveUserReportsStats = async (userReportsStats) => {
  let id = 2;
  for (const [user_id, { uniqueViews, sessionsCount, sessionsTime }] of Object.entries(userReportsStats)) {
    try {
      await CustomersReport.upsert({
        id: id++,
        customerId: user_id.replace(/,/g, ''), // Remove commas from userId
        uniqueViews: uniqueViews.size,
        reportId,
        sessionsCount,
        averageTime: sessionsTime / sessionsCount || 0,
        sessionsTime,
        accountType: 'user'
      });
    } catch (error) {
      console.error(`Error saving customer data for user ${user_id}: ${error}`);
    }
  }
};

export const saveContentData = async (contentStats) => {
  for (const [content_id, stats] of Object.entries(contentStats)) {
    try {
      await Content.upsert({
        id: content_id.replace(/,/g, ''), // Remove commas from contentId
        ...stats,
        usersCount: stats.usersCount.size,
        // additional fields can be added here
      });
    } catch (error) {
      console.error(`Error saving content data for content ${content_id}: ${error}`);
    }
  }
};

export const saveContentReportsData = async (contentReports) => {
  let id = 2;
  for (const [content_id, stats] of Object.entries(contentReports)) {
    try {
      await ContentReports.upsert({
        id: id++,
        contentId: content_id.replace(/,/g, ''), // Remove commas from contentId
        reportId,
        ...stats,
        usersCount: stats.usersCount.size,
      });
    } catch (error) {
      console.error(`Error saving content data for content ${content_id}: ${error}`);
    }
  }
};

export const saveDailyData = async (jsonData) => {
  const dailyDurations = {};
  const hourlyViewCounts = {};

  jsonData.forEach(({ view_start, duration }) => {
    // Directly extract the date part from the view_start string
    const dateKey = new Date(view_start).toISOString().substring(0, 10); // Format date as YYYY-MM-DD
    const viewHour = new Date(view_start).getUTCHours();

    // Initialize or update total duration for the date
    if (!dailyDurations[dateKey]) {
      dailyDurations[dateKey] = { totalDuration: 0, primeTime: null };
      hourlyViewCounts[dateKey] = new Array(24).fill(0);
    }
    dailyDurations[dateKey].totalDuration += typeof duration === 'string' ? parseInt(duration.replace(/,/g, '')) : parseInt(duration); // Handle duration as string or number

    // Count views for each hour in UTC
    hourlyViewCounts[dateKey][viewHour]++;
  });

  // Determine primeTime for each date
  for (const [dateKey, hours] of Object.entries(hourlyViewCounts)) {
    const maxViews = Math.max(...hours);
    const primeTimeHour = hours.indexOf(maxViews);
    dailyDurations[dateKey].primeTime = `${primeTimeHour}:00`;
  }

  // Store in database
  for (const [date, { totalDuration, primeTime }] of Object.entries(dailyDurations)) {
    try {
      await DailyData.upsert({
        date,
        totalDuration,
        primeTime
      });
    } catch (error) {
      console.error(`Error saving daily duration for date ${date}: ${error}`);
    }
  }
};
