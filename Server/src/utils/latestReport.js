import { Report } from "../database/index.js";

const latestReport = async () => {
    const report = await Report.findOne({
        order: [['createdAt', 'DESC']]
    });
    return report;
};

export default latestReport;