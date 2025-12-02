module.exports = {
    command: "menu",
    description: "Show bot menu",
    category: "general",

    execute: async (sock, m, { reply }) => {
        reply(
`╔═══❰  *MRVIRUSX MENU*  ❱═══╗

⚡ .alive
⚡ .ping
⚡ .user
⚡ .premium
⚡ .tools
⚡ .bugs

✨ More features coming…

╚══════════════════════╝`
        );
    }
};