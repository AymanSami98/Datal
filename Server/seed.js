// seed.js
import sequelize from './src/config/database.js';
import {User, Content, ContentReports, DailyData , Customer, CustomersReport, Report, fakeUsers} from './src/database/index.js';

async function seed() {
  try {
    await sequelize.sync({ force: true });

    for (const fakeUser of fakeUsers) {
      await User.create(fakeUser);
    }

const today = new Date();
await Content.create({
  id: 1,
  duration: 1,
  filename: 'title',
  publishDate: today,
});
await Report.create({
  id: 3,
  date: today,
  uniqueViews: 1,
  sessionsCount: 1,
  sessionsTime: 1,
  usersCount: 1,
});
await ContentReports.create({
  id: 1,
  contentId: 1,
  reportId: 3,
  sessionsTime: 1,
  sessionsCount: 1,
  usersCount: 1,
  type: 'type',
  primeTime: 'primeTime',
});
await Customer.create({
  id: 1,
  accountType: 'type',
});
await CustomersReport.create({
  id: 1,
  customerId: 1,
  uniqueViews: 1,
  sessionsCount: 1,
  sessionsTime: 1,
  averageTime: 1,
  accountType: 'type',
});
await DailyData.create({
  date: 'date',
  totalDuration: 1,
  primeTime: 'primeTime',
});




    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    process.exit(0);
  }
}

seed();
