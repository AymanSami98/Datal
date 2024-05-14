/* eslint-disable no-unused-vars */
// routes/index.js
import { Router } from 'express';
import authRouter from './auth/index.js';
import { getAllData, getCustomerData, updateAllContentsController, uploadDataController, uploadCsvController } from '../controllers/index.js';
import { ContentReports, DailyData, Content, Customer, CustomersReport, Report } from '../database/index.js';
import { authenticate } from '../middlewares/index.js';
import latestReport from '../utils/latestReport.js';

const router = Router();

router.use('/auth', authRouter);

router.post('/upload-json', uploadDataController);
router.post('/upload-csv', uploadCsvController);

router.get('/get-all-data', async (req, res) => {
    const data = await getAllData();
    res.send(data);
}
);
router.get('/get-customer-data/:id', async (req, res) => {
    const data = await getCustomerData(req.params.id);
    res.send(data);
}
);

router.get('/update-all-contents', updateAllContentsController);
router.get('/get-all-contents', (req, res) => {
    Content.findAll()
        .then((data) => res.send(data))
        .catch((err) => console.error(err));
});


router.get('/get-matched-content-and-content-reports', async (req, res) => {
    try {
        const latest = await latestReport(); // Fetch the latest report
        const latestReportId = latest.id;
        const data = await Content.findAll({
            include: {
                model: ContentReports,
                required: true,
                where: {
                    reportId: latestReportId // Update to correct column name
                }
            }
        });

        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/get-matched-users-and-customers-reports', async (req, res) => {
    try {
        const latest = await latestReport(); // Fetch the latest report
        const latestReportId = latest.id;
        const data = await Customer.findAll({
            include: {
                model: CustomersReport,
                required: true,
                where: {
                    reportId: latestReportId // Update to correct column name
                }
            }
        });
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/get-all-customers', (req, res) => {
    Customer.findAll()
        .then((data) => res.send(data))
        .catch((err) => console.error(err));
}
);
router.get('/get-all-daily-durations', (req, res) => {
    DailyData.findAll()
        .then((data) => res.send(data))
        .catch((err) => console.error(err));
}
);
router.get('/get-all-reports', (req, res) => {
    Report.findAll()
        .then((data) => res.send(data))
        .catch((err) => console.error(err));
}
);


export default router;

router.get('/get-contents-and-contents-reports-by-id/:reportId', async (req, res) => {
    try {
        const { reportId } = req.params;
        const data = await Content.findAll({
            include: {
                model: ContentReports,
                required: true,
                where: {
                    reportId: reportId
                }
            }
        });

        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/get-customers-and-customers-reports-by-id/:reportId', async (req, res) => {

    try {
        const { reportId } = req.params;
        const data = await Customer.findAll({
            include: {
                model: CustomersReport,
                required: true,
                where: {
                    reportId: reportId
                }
            }
        });

        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);
