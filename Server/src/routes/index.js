/* eslint-disable no-unused-vars */
// routes/index.js
import { Router } from 'express';
import authRouter from './auth/index.js';
import {updateAllContentsController, uploadDataController} from '../controllers/index.js';
import { ContentReports,DailyData,Content,Customer, CustomersReport, Report } from '../database/index.js';

const router = Router();

router.use('/auth', authRouter);
router.post('/upload-json', uploadDataController);
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
