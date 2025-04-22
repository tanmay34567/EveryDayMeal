import cron from 'node-cron';
import Menu from '../models/Menu.js';

const scheduleMenuDeletion = () => {
  // Runs every day at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    try {
      const result = await Menu.deleteMany({});
      console.log(`Deleted ${result.deletedCount} menus at midnight.`);
    } catch (err) {
      console.error('Error deleting menus at midnight:', err);
    }
  });
};

export default scheduleMenuDeletion;
