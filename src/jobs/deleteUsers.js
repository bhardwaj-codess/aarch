const cron = require("node-cron");
const { User } = require("../models/User"); // relative path

// Schedule: every day at midnight
// cron.schedule("0 0 * * *", async () => {
  cron.schedule("0 * * * * *", async () => { 
  try {
    const now = new Date();
    const usersToDelete = await User.find({
      deleteRequestedAt: { $lte: new Date(now - 2 * 60 * 1000) }
    });

    for (const user of usersToDelete) {
      // Delete related collections if any (messages, events, etc.)
      // await Message.deleteMany({ userId: user._id });
      // await Event.deleteMany({ userId: user._id });

      await User.deleteOne({ _id: user._id });
      console.log(`Deleted user ${user.email} and related data`);
    }
  } catch (err) {
    console.error("Scheduled user deletion error:", err);
  }
});
