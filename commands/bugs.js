const fs = require("fs");
const path = require("path");

module.exports = {
    command: "bugs",
    description: "Send all bug files",
    category: "developer",

    execute: async (sock, m, { reply }) => {
        const bugFolder = path.join(__dirname, "../bugs");

        if (!fs.existsSync(bugFolder))
            return reply("❌ No bug folder found!");

        const files = fs.readdirSync(bugFolder).filter(f => f.endsWith(".js"));

        if (!files.length)
            return reply("❌ No bugs found.");

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const content = fs.readFileSync(path.join(bugFolder, file), "utf8");

            await sock.sendMessage(m.chat, {
                text: `🐞 *Bug #${i + 1}*\n📄 File: ${file}\n\n${content}`
            });
        }
    }
};