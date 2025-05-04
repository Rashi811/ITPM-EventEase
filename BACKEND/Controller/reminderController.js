const Reminder = require("../Model/Reminder");
const Event = require("../Model/Event");
const cron = require("node-cron");

// Create a new reminder
// exports.createReminder = async (req, res) => {
//     try {
//         const { reminder_topic, reminder_note, contactNumber, email, date, time } = req.body;
//         const newReminder = new Reminder({ reminder_topic, reminder_note, contactNumber, email, date, time });
//         await newReminder.save();
//         res.status(201).json({ message: "Reminder created successfully", reminder: newReminder });
//     } catch (error) {
//         res.status(500).json({ message: "Error creating reminder", error });
//     }
// };

exports.createReminder = async (req, res) => {
    try {
        const { reminder_topic, reminder_note, contactNumber, email, date, time } = req.body;

        // Convert time to 12-hour format with AM/PM
        const formatTimeWithAmPm = (timeString) => {
            const [hours, minutes] = timeString.split(":").map(Number);
            const period = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
            return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
        };

        const formattedTime = formatTimeWithAmPm(time);

        const newReminder = new Reminder({
            reminder_topic,
            reminder_note,
            contactNumber,
            email,
            date,
            time: formattedTime, // Save formatted time
        });

        await newReminder.save();
        res.status(201).json({ message: "Reminder created successfully", reminder: newReminder });
    } catch (error) {
        res.status(500).json({ message: "Error creating reminder", error });
    }
};

// View all reminders
exports.getAllReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find();
        res.status(200).json({ reminders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching reminders", error });
    }
};

// View one reminder by ID
exports.getReminderById = async (req, res) => {
    try {
        const { id } = req.params;
        const reminder = await Reminder.findById(id);
        if (!reminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        res.status(200).json({ reminder });
    } catch (error) {
        res.status(500).json({ message: "Error fetching reminder", error });
    }
};

// Update a reminder by ID
exports.updateReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reminder_topic, reminder_note, contactNumber, email, date, time } = req.body;
        const updatedReminder = await Reminder.findByIdAndUpdate(
            id,
            { reminder_topic, reminder_note, contactNumber, email, date, time },
            { new: true }
        );
        if (!updatedReminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        res.status(200).json({ message: "Reminder updated successfully", reminder: updatedReminder });
    } catch (error) {
        res.status(500).json({ message: "Error updating reminder", error });
    }
};


// Delete a reminder by ID
exports.deleteReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReminder = await Reminder.findByIdAndDelete(id);
        if (!deletedReminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }
        res.status(200).json({ message: "Reminder deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting reminder", error });
    }
};

// Delete all reminders
exports.deleteAllReminders = async (req, res) => {
    try {
        await Reminder.deleteMany({});
        res.status(200).json({ message: "All reminders deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting all reminders", error });
    }
};

// Auto-create reminders one day before events
exports.autoCreateRemindersForEvents = async () => {
    try {
        const events = await Event.find();
        const reminders = [];

        // Get the current date in local time zone (YYYY-MM-DD format)
        const currentDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(new Date());

        for (const event of events) {
            const eventDate = new Date(event.date);
            const reminderDate = new Date(eventDate);
            reminderDate.setDate(reminderDate.getDate() - 1); // Set reminder one day before the event

            const formattedReminderDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(reminderDate);

            console.log("Reminder Date: ", formattedReminderDate);
            console.log("Current Date: ", currentDate);
            console.log("Event Date: ", eventDate);

            if (formattedReminderDate === currentDate) {
                // Check if a reminder already exists for this event
                const existingReminder = await Reminder.findOne({ reminder_topic: `${event.eventName}` });

                if (!existingReminder) {
                    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                    const newReminder = new Reminder({
                        reminder_topic: `${event.eventName}`,
                        reminder_note: `Don't forget about the event ${event.eventName} happening on ${eventDate.toISOString().split("T")[0]}.`,
                        contactNumber: event.contactNumber,
                        email: event.email,
                        date: reminderDate,
                        time: currentTime, // Set current time
                    });

                    await newReminder.save();
                    reminders.push(newReminder);
                    console.log(`Reminder created for event: ${event.eventName}`);
                } else {
                    console.log(`Reminder already exists for event: ${event.eventName}`);
                }
            }
        }

        if (reminders.length === 0) {
            console.log("No new reminders created. No events match the criteria.");
        }
    } catch (error) {
        console.error("Error creating reminders for events", error);
    }
};

// Schedule the function to run every hour
cron.schedule("* * * * *", async () => {
    console.log("Running autoCreateRemindersForEvents...");
    await exports.autoCreateRemindersForEvents();
});

