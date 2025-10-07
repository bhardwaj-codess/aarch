const cron = require("node-cron");

const { User } = require("../models/User");
const Artist = require("../models/Artist");
const SupportTicket = require("../models/SupportTicket");

// Run every minute
// cron.schedule("0 0 * * *", async () => {
cron.schedule("0 * * * * *", async () => { //for testing, two minute
  try {
    const cutoff = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago
    const usersToDelete = await User.find({
      deleteRequestedAt: { $lte: cutoff }
    });

    for (const user of usersToDelete) {
      const userId = user._id;

      await Promise.all([
        Artist.deleteMany({ userId }),
        SupportTicket.deleteMany({ userId }),
        // Event.deleteMany({ ownerId: userId }),
        // Message.deleteMany({ senderId: userId }),
        // Add any other related deletes here
      ]);

      await User.deleteOne({ _id: userId });

      console.log(`Deleted user ${user.email} and all related data`);
    }
  } catch (err) {
    console.error("Scheduled user deletion error:", err);
  }
});
