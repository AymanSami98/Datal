// dataController.js

import { saveCustomerData, saveContentData, saveDailyData, saveContentReportsData, saveUserReportsStats } from '../services/uploadDataService.js';
import {
  calculateUserStats,
  calculateContentStats,
  calculateContentReportsStats,
  calculateUserReportsStats
} from '../middlewares/index.js';

const uploadDataController = async (req, res) => {
  try {
    const jsonData = req.body.data;
    const userStats = calculateUserStats(jsonData);
    const contentStats = calculateContentStats(jsonData);
    const contentReportsStats = calculateContentReportsStats(jsonData);
    const userReportsStats = calculateUserReportsStats(jsonData);
    await saveCustomerData(userStats);
    await saveContentData(contentStats);
    await saveContentReportsData(contentReportsStats);
    await saveDailyData(jsonData);
    await saveUserReportsStats(userReportsStats);
    res.status(200).send('Data processed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export default uploadDataController;
