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
      type: content_title.toLowerCase().includes('pm') ? 'Livestream' : 'On Demand',
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
    uniqueViews: new Set(),
    sessionsCount: 0,
    sessionsTime: 0,
    usersCount: new Set()
  };

  jsonData.forEach(({ user_id, duration }) => {
    // Check if the view is unique before incrementing uniqueViews
    if (!stats.uniqueViews.has(user_id)) {
      stats.uniqueViews.add(user_id);
    }

    stats.sessionsCount++;
    // Adjust duration parsing to handle comma-separated values
    const parsedDuration = typeof duration === 'string' ? parseInt(duration.replace(',', '')) : parseInt(duration);
    stats.sessionsTime += parsedDuration;
    stats.usersCount.add(user_id);
  });

  // Convert the uniqueViews Set to its size to get the count
  stats.uniqueViews = stats.uniqueViews.size;

  return stats;
};



export {
  calculateUserStats,
  calculateContentStats,
  calculateContentReportsStats,
  calculateUserReportsStats,
  calculateReportStats
}