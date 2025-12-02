module.exports = {
    command: "tools",
    description: "Show available tools",
    category: "tools",

    execute: async (sock, m, { reply }) => {
        reply(
`🔧 *TOOLS AVAILABLE*:

• .ping – response speed
• .alive – bot status
• .bugs – view bug files
• .menu – show commands`
        );
    }
};