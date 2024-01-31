import User from "./user.js";
import Content from "./contents.js";
import ContentReports from "./contentReports.js";
import DailyData from "./dailyData.js";
import Customer from "./customers.js";
import CustomersReport from "./customersReport.js";
import Report from "./report.js";
ContentReports.belongsTo(Report, { foreignKey: 'reportId' });
Report.hasMany(ContentReports, { foreignKey: 'reportId' });

ContentReports.belongsTo(Content, { foreignKey: 'contentId' });
Content.hasMany(ContentReports, { foreignKey: 'contentId' });

CustomersReport.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(CustomersReport, { foreignKey: 'customerId' });

CustomersReport.belongsTo(Report, { foreignKey: 'reportId' });
Report.hasMany(CustomersReport, { foreignKey: 'reportId' });

export { User, Content, ContentReports, DailyData , Customer, CustomersReport, Report };