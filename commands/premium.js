module.exports = {
    command: "user",
    description: "User info",
    category: "general",

    execute: async (sock, m, { sender, reply }) => {
        reply(`👤 User: @${sender.split("@")[0]}`, {
            mentions: [sender]
        });
    }
};