const calculateUserStats = (jsonData) => {
  const stats = {};
  jsonData.forEach(({ user_id, content_id, duration }) => {
    const userIdInt = parseInt(user_id.replace(/,/g, '')); // Parse user_id as an integer, removing commas if present
    stats[userIdInt] = stats[userIdInt] || { uniqueViews: new Set(), sessionsCount: 0, sessionsTime: 0 };
    stats[userIdInt].uniqueViews.add(content_id);
    stats[userIdInt].sessionsCount++;
    // Adjust duration parsing to handle comma-separated values
    const parsedDuration = typeof duration === 'string' ? parseInt(duration.replace(',', '')) : parseInt(duration);
    stats[userIdInt].sessionsTime += parsedDuration;
  });
  return stats;
};

const calculateContentStats = (jsonData) => {
  const stats = {};

  jsonData.forEach(({ content_id, duration, content_title, user_id, view_start }) => {
    stats[content_id] = stats[content_id] || {
      title: content_title,
      sessionsTime: 0,
      sessionsCount: 0,
      usersCount: new Set(),
      hourlyViews: new Array(24).fill(0),
      primeTime: null
    };

    const viewHour = new Date(view_start).getUTCHours();
    stats[content_id].sessionsCount++;
    // Adjust duration parsing to handle comma-separated values
    const parsedDuration = typeof duration === 'string' ? parseInt(duration.replace(',', '')) : parseInt(duration);
    stats[content_id].sessionsTime += parsedDuration;
    stats[content_id].usersCount.add(user_id);
    stats[content_id].hourlyViews[viewHour]++;
  });

  // Determine primeTime for each content
  for (const contentId in stats) {
    const maxViews = Math.max(...stats[contentId].hourlyViews);
    const primeTimeHour = stats[contentId].hourlyViews.indexOf(maxViews);
    stats[contentId].primeTime = `${primeTimeHour}:00`;
  }

  return stats;
};

const calculateContentReportsStats = (jsonData) => {
  const stats = {};

  jsonData.forEach(({ content_id, duration, content_title, user_id, view_start }) => {
    stats[content_id] = stats[content_id] || {
      title: content_title,
      sessionsTime: 0,
      sessionsCount: 0,
      usersCount: new Set(),
      hourlyViews: new Array(24).fill(0),
      primeTime: null
    };

    const viewHour = new Date(view_start).getUTCHours();
    stats[content_id].sessionsCount++;
    // Adjust duration parsing to handle comma-separated values
    const parsedDuration = typeof duration === 'string' ? parseInt(duration.replace(',', '')) : parseInt(duration);
    stats[content_id].sessionsTime += parsedDuration;
    stats[content_id].usersCount.add(user_id);
    stats[content_id].hourlyViews[viewHour]++;
  });

  // Determine primeTime for each content
  for (const contentId in stats) {
    const maxViews = Math.max(...stats[contentId].hourlyViews);
    const primeTimeHour = stats[contentId].hourlyViews.indexOf(maxViews);
    stats[contentId].primeTime = `${primeTimeHour}:00`;
  }

  return stats;
};

const calculateUserReportsStats = (jsonData) => {
  const stats = {};
  jsonData.forEach(({ user_id, content_id, duration }) => {
    stats[user_id] = stats[user_id] || { uniqueViews: new Set(), sessionsCount: 0, sessionsTime: 0 };
    stats[user_id].uniqueViews.add(content_id);
    stats[user_id].sessionsCount++;
    // Adjust duration parsing to handle comma-separated values
    const parsedDuration = typeof duration === 'string' ? parseInt(duration.replace(',', '')) : parseInt(duration);
    stats[user_id].sessionsTime += parsedDuration;
  });
  return stats;
};

const calculateReportStats = (jsonData) => {
  const stats = {
    uniqueViews: 0,
    sessionsCount: 0,
    sessionsTime: 0,
    rollingAverage: 0,
    usersCount: new Set()
  };
 // [
  //   {
  //     session_id: '7fab4c65f493693c812b10516346edc93e3d673f',
  //     date: 'March 31, 2024',
  //     duration: '1,365',
  //     view_start: 'March 31, 2024, 11:51 PM',
  //     view_end: 'April 1, 2024, 12:16 AM',
  //     user_id: '14,718,450',
  //     user_email: 'alialioop_79@yahoo.co.uk',
  //     content_type: 'video',
  //     content_id: '2,063,195',
  //     content_title: 'Vague',
  //     video_id: '2,063,195',
  //     video_title: 'Vague',
  //     author_title: '["Maisie Adam"]',
  //     author_id: '[60697]',
  //     country_name: 'United Kingdom',
  //     browser: 'BrowserChrome',
  //     os: 'OSAndroid',
  //     source: 'web',
  //     last_activity: 'April 1, 2024, 12:05 AM'
  //   },]
  // Iterate over the JSON data to aggregate statistics
  jsonData.forEach(({ user_id,  duration }) => {
    stats.uniqueViews++;
    stats.sessionsCount++;
    // Adjust duration parsing to handle comma-separated values
    const parsedDuration = typeof duration === 'string' ? parseInt(duration.replace(',', '')) : parseInt(duration);
    stats.sessionsTime += parsedDuration;
    stats.usersCount.add(user_id);
  });

  // Calculate rolling average based on previous tootal sessions time and count
  stats.rollingAverage = stats.sessionsTime / stats.sessionsCount || 0;

  return stats;

};


export {
  calculateUserStats,
  calculateContentStats,
  calculateContentReportsStats,
  calculateUserReportsStats,
  calculateReportStats
}