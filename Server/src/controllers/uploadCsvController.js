// dataController.js

import { saveCustomerData, saveContentData, saveDailyData, saveContentReportsData, saveUserReportsStats, saveReport } from '../services/uploadDataService.js';
import {
  calculateUserStats,
  calculateContentStats,
  calculateContentReportsStats,
  calculateUserReportsStats,
  calculateReportStats
} from '../middlewares/processCsvData.js';

const uploadCsvController = async (req, res) => {
  try {
    const csvData = req.body.data;
    const reportStats = calculateReportStats(csvData);
    const reportId = await saveReport(reportStats);
    const userStats = calculateUserStats(csvData);
    const contentStats = calculateContentStats(csvData);
    const contentReportsStats = calculateContentReportsStats(csvData);
    const userReportsStats = calculateUserReportsStats(csvData);
    await saveCustomerData(userStats);
    await saveContentData(contentStats);
    await saveContentReportsData(contentReportsStats, reportId);
    await saveDailyData(csvData);
    await saveUserReportsStats(userReportsStats, reportId);
    res.status(200).send('Data processed successfully');
  } catch (error) {
    console.error(error);
    console.log('Error in uploadCsvController:', error);
    res.status(500).send(error.message);
  }
};

export default uploadCsvController;
