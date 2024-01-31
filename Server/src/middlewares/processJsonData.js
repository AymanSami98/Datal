

const calculateUserStats = (jsonData) => {
  const stats = {};
  jsonData.forEach(({ UserID, ContentID, Duration }) => {
    stats[UserID] = stats[UserID] || { uniqueViews: new Set(), sessionsCount: 0, sessionsTime: 0 };
    stats[UserID].uniqueViews.add(ContentID);
    stats[UserID].sessionsCount++;
    stats[UserID].sessionsTime += Duration;
  });
  return stats;
};

const calculateContentStats = (jsonData) => {
  const stats = {};

  jsonData.forEach(({ ContentID, Duration, ContentTitle, UserID, ViewStart }) => {
    stats[ContentID] = stats[ContentID] || {
      title: ContentTitle,
      sessionsTime: 0,
      sessionsCount: 0,
      usersCount: new Set(),
      hourlyViews: new Array(24).fill(0),
      primetime: null
    };

    const viewHour = new Date(ViewStart).getUTCHours();
    stats[ContentID].sessionsCount++;
    stats[ContentID].sessionsTime += Duration;
    stats[ContentID].usersCount.add(UserID);
    stats[ContentID].hourlyViews[viewHour]++;
  });

  // Determine primetime for each content
  for (const contentId in stats) {
    const maxViews = Math.max(...stats[contentId].hourlyViews);
    const primetimeHour = stats[contentId].hourlyViews.indexOf(maxViews);
    stats[contentId].primeTime = `${primetimeHour}:00`;
  }

  return stats;
};


const calculateContentReportsStats = (jsonData) => {
  const stats = {};

  jsonData.forEach(({ ContentID, Duration, ContentTitle, UserID, ViewStart }) => {
    stats[ContentID] = stats[ContentID] || {
      title: ContentTitle,
      sessionsTime: 0,
      sessionsCount: 0,
      usersCount: new Set(),
      hourlyViews: new Array(24).fill(0),
      primetime: null
    };

    const viewHour = new Date(ViewStart).getUTCHours();
    stats[ContentID].sessionsCount++;
    stats[ContentID].sessionsTime += Duration;
    stats[ContentID].usersCount.add(UserID);
    stats[ContentID].hourlyViews[viewHour]++;
  });

  // Determine primetime for each content
  for (const contentId in stats) {
    const maxViews = Math.max(...stats[contentId].hourlyViews);
    const primetimeHour = stats[contentId].hourlyViews.indexOf(maxViews);
    stats[contentId].primeTime = `${primetimeHour}:00`;
  }

  return stats;
}


const calculateUserReportsStats = (jsonData) => {
  const stats = {};
  jsonData.forEach(({ UserID, ContentID, Duration }) => {
    stats[UserID] = stats[UserID] || { uniqueViews: new Set(), sessionsCount: 0, sessionsTime: 0 };
    stats[UserID].uniqueViews.add(ContentID);
    stats[UserID].sessionsCount++;
    stats[UserID].sessionsTime += Duration;
  });
  return stats;
};
export {
  calculateUserStats,
  calculateContentStats,
  calculateContentReportsStats,
  calculateUserReportsStats
}