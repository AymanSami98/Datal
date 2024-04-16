const calculateUserStats = (jsonData) => {
  const stats = {};
  jsonData.forEach(({ UserID, ContentID, Duration }) => {
    stats[UserID] = stats[UserID] || { uniqueViews: new Set(), sessionsCount: 0, sessionsTime: 0 };
    stats[UserID].uniqueViews.add(ContentID);
    stats[UserID].sessionsCount++;
    stats[UserID].sessionsTime += typeof Duration === 'string' ? parseInt(Duration.replace(',', '')) : Duration; // Check if Duration is a string before replacing commas
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
      primeTime: null // Changed 'primetime' to 'primeTime' for consistency
    };

    const viewHour = new Date(ViewStart).getUTCHours();
    stats[ContentID].sessionsCount++;
    stats[ContentID].sessionsTime += typeof Duration === 'string' ? parseInt(Duration.replace(',', '')) : Duration; // Check if Duration is a string before replacing commas
    stats[ContentID].usersCount.add(UserID);
    stats[ContentID].hourlyViews[viewHour]++;
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

  jsonData.forEach(({ ContentID, Duration, ContentTitle, UserID, ViewStart }) => {
    stats[ContentID] = stats[ContentID] || {
      title: ContentTitle,
      sessionsTime: 0,
      sessionsCount: 0,
      usersCount: new Set(),
      hourlyViews: new Array(24).fill(0),
      primeTime: null // Changed 'primetime' to 'primeTime' for consistency
    };

    const viewHour = new Date(ViewStart).getUTCHours();
    stats[ContentID].sessionsCount++;
    stats[ContentID].sessionsTime += typeof Duration === 'string' ? parseInt(Duration.replace(',', '')) : Duration; // Check if Duration is a string before replacing commas
    stats[ContentID].usersCount.add(UserID);
    stats[ContentID].hourlyViews[viewHour]++;
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
  jsonData.forEach(({ UserID, ContentID, Duration }) => {
    stats[UserID] = stats[UserID] || { uniqueViews: new Set(), sessionsCount: 0, sessionsTime: 0 };
    stats[UserID].uniqueViews.add(ContentID);
    stats[UserID].sessionsCount++;
    stats[UserID].sessionsTime += typeof Duration === 'string' ? parseInt(Duration.replace(',', '')) : Duration; // Check if Duration is a string before replacing commas
  });
  return stats;
};

export {
  calculateUserStats,
  calculateContentStats,
  calculateContentReportsStats,
  calculateUserReportsStats
}