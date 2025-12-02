module.exports = {
    command: "alive",
    description: "Check bot status",
    category: "general",

    execute: async (sock, m, { reply }) => {
        await sock.sendMessage(m.chat, { react: { text: "⚡", key: m.key } });

        const text = `
╔═══❰  *🤖 BOT STATUS*  ❱═══╗
   ✔ Bot is Online
   ✔ All systems working
   ✔ Powered by MRVIRUSX ⚡
╚══════════════════════╝
`;

        reply(text);
        await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    }
};