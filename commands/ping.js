module.exports = {
    command: "ping",
    description: "Shows response speed",
    category: "general",

    execute: async (sock, m, { reply }) => {
        const start = Date.now();
        await reply("🏓 Pinging...");
        const end = Date.now();

        reply(`🏓 Pong!\n⚡ *${end - start}ms*`);
    }
};