/* eslint-disable no-unused-vars */
// routes/index.js
import { Router } from 'express';
import authRouter from './auth/index.js';
import {getAllData, getCustomerData, updateAllContentsController, uploadDataController,uploadCsvController} from '../controllers/index.js';
import { ContentReports,DailyData,Content,Customer, CustomersReport, Report } from '../database/index.js';
import { authenticate } from '../middlewares/index.js';

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

router.get('/get-matched-content-and-content-reports', (req, res) => {
    Content.findAll({
        include: {
            model: ContentReports,
            required: true
        }
    })
        .then((data) => res.send(data))
        .catch((err) => console.error(err));
    }
);

router.get('/get-matched-users-and-customers-reports', (req, res) => {
    Customer.findAll({
        include: {
            model: CustomersReport,
            required: true
        }
    })
        .then((data) => res.send(data))
        .catch((err) => console.error(err));
    }
);
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
