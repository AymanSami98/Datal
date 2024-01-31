
import { Customer, Content, DailyData, ContentReports, CustomersReport } from '../database/index.js';

export const saveCustomerData = async (userStats) => {
  for (const [userId, { uniqueViews, sessionsCount, sessionsTime }] of Object.entries(userStats)) {
    try {
      await Customer.upsert({
        id: userId,
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
  let id = 2;
  for (const [userId, { uniqueViews, sessionsCount, sessionsTime }] of Object.entries(userReportsStats)) {
    try {
      await CustomersReport.upsert({
        id: id++,
        customerId: userId,
        uniqueViews: uniqueViews.size,
        reportId: 11111,
        sessionsCount,
        averageTime: sessionsTime / sessionsCount || 0,
        sessionsTime,
        accountType: 'user'
      });
    } catch (error) {
      console.error(`Error saving customer data for user ${userId}: ${error}`);
    }
  }
}

export const saveContentData = async (contentStats) => {
  for (const [contentId, stats] of Object.entries(contentStats)) {
    try {
      await Content.upsert({
        id: contentId,
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
  let id = 2;
  for (const [contentId, stats] of Object.entries(contentReports)) {
    try {
      await ContentReports.upsert({
        id: id++,
        contentId: contentId,
        reportId: 11111,
        ...stats,
        usersCount: stats.usersCount.size,
      });
    } catch (error) {
      console.error(`Error saving content data for content ${contentId}: ${error}`);
    }
  }
}




export const saveDailyData = async (jsonData) => {
  const dailyDurations = {};
  const hourlyViewCounts = {};

  jsonData.forEach(({ ViewStart, Duration }) => {
    // Directly extract the date part from the ViewStart string
    const dateKey = ViewStart.substring(0, 10);
    const viewHour = new Date(ViewStart).getUTCHours();

    // Initialize or update total duration for the date
    if (!dailyDurations[dateKey]) {
      dailyDurations[dateKey] = { totalDuration: 0, primetime: null };
      hourlyViewCounts[dateKey] = new Array(24).fill(0);
    }
    dailyDurations[dateKey].totalDuration += Duration;

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
