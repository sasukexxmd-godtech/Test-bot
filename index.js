const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const path = require("path");
const pino = require("pino");
const chalk = require("chalk");
const readline = require("readline");

// Ask question in terminal
async function ask(text) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve =>
        rl.question(text, answer => {
            rl.close();
            resolve(answer.trim());
        })
    );
}

async function startBot() {
    console.log(chalk.cyan("\n📱 WhatsApp Number Login (Baileys)\n"));

    const phoneNumber = await ask("Enter your WhatsApp number (with country code): ");

    if (!phoneNumber)
        return console.log(chalk.red("❌ No number provided!"));

    const { state, saveCreds } = await useMultiFileAuthState("./auth");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
        },
        browser: Browsers.macOS("Safari")
    });

    // Request pairing code
    const code = await sock.requestPairingCode(phoneNumber);
    console.log(chalk.green("\n🔐 PAIRING CODE:"));
    console.log(chalk.yellow("👉 " + code));
    console.log(chalk.cyan("\nOpen WhatsApp → Linked Devices → Link with phone number\nPaste the code above.\n"));

    // ==========================
    // LOAD COMMANDS
    // ==========================
    const commands = new Map();
    const commandFolder = path.join(__dirname, "commands");

    if (fs.existsSync(commandFolder)) {
        fs.readdirSync(commandFolder).forEach(file => {
            if (file.endsWith(".js")) {
                const cmd = require(path.join(commandFolder, file));
                commands.set(cmd.command, cmd);
                console.log(chalk.green(`[LOADED] Command: ${cmd.command}`));
            }
        });
    }

    // ==========================
    // MESSAGE HANDLER
    // ==========================
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;

        const body =
            m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            "";

        if (!body.startsWith(".")) return;

        const args = body.slice(1).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();

        const cmd = commands.get(cmdName);
        if (!cmd) return;

        const reply = (text) =>
            sock.sendMessage(m.key.remoteJid, { text }, { quoted: m });

        try {
            await cmd.execute(sock, m, {
                args,
                reply,
                sender: m.key.participant || m.key.remoteJid,
                chat: m.key.remoteJid
            });
        } catch (err) {
            console.log(err);
            reply("❌ Error executing command.");
        }
    });

    // Auto-save credentials
    sock.ev.on("creds.update", saveCreds);

    // Reconnect if closed
    sock.ev.on("connection.update", ({ connection }) => {
        if (connection === "close") {
            console.log(chalk.red("❌ Connection closed! Restarting..."));
            startBot();
        }
        if (connection === "open") {
            console.log(chalk.green("✅ Connected Successfully!"));
        }
    });
}

startBot();