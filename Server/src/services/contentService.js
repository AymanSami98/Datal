// contentService.js
import axios from 'axios';
import Content from '../database/models/contents.js';

const uscreenApiKey = process.env.USCREEN_API_KEY;

const fetchContentData = async (id, retryCount = 0) => {
  try {
    const headers = {
      Authorization: `Bearer ${uscreenApiKey}`,
      "Content-Type": "application/json",
    };

    const response = await axios.get(
      `https://www.uscreen.io/publisher_api/v1/videos/${id}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.warn(`Content with ID ${id} not found.`);
        return null; // Return null to indicate not found
      }

      // Handle 429 Too Many Requests with Exponential Backoff
      if (error.response.status === 429 && retryCount < 5) {
        const waitTime = Math.pow(2, retryCount) * 100;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchContentData(id, retryCount + 1);
      }
    }

    console.error("Error fetching content data:", error);
    throw new Error("Unable to fetch content data.");
  }
};

const updateContentTable = async (id) => {
  try {
    const apiData = await fetchContentData(id);

    if (!apiData) {
      console.warn(`No data found for ID ${id}, skipping.`);
      return; // Skip this ID and continue
    }
    const existingContent = await Content.findByPk(id);

    const contentData = {
      id: apiData.id,
      publishDate: new Date(apiData.created_at * 1000),
      duration: apiData.duration,
      //if apiData.duration is less than 15 minutes, then it is a short video and the type is short  and if existingContent.title has pm in it, then it is a live video
      type: apiData.duration < 900 ? 'Short Form' : existingContent.title.includes('pm') ? 'Livesream' : 'On Demand'
      
    };
   // If the title is not null in the database, retain the existing title
   if (existingContent && existingContent.title) {
    contentData.title = existingContent.title;
  } else {
    contentData.title = apiData.filename; // Assuming filename is the title from API
  }

    await Content.upsert(contentData);
  } catch (error) {
    console.error(`Error updating content table for ID ${id}:`, error);
    // Consider how you want to handle errors - throw or log and continue
  }
};


const updateMultipleContents = async (ids) => {
  for (const id of ids) {
    try {
      await updateContentTable(id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay of 1 second
    } catch (error) {
      console.error(`Error updating content with ID ${id}:`, error);
    }
  }
};


const updateAllContents = async () => {
  try {
    const allContents = await Content.findAll({
      attributes: ['id'],
      raw: true,
    });

    const ids = allContents.map(content => content.id);
    await updateMultipleContents(ids);
  } catch (error) {
    console.error("Error updating all contents:", error);
    throw error;
  }
};

export { updateAllContents };
