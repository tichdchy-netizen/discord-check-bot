const { Client, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;       // ใส่ใน Render Environment
const API_URL = process.env.API_URL;   // ใส่ใน Render Environment
// ==========================================

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ====== REGISTER SLASH COMMAND ======
client.once("clientReady", async () => {
  const command = new SlashCommandBuilder()
    .setName("check")
    .setDescription("ตรวจสอบชื่อจาก Google Sheet")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("ชื่อที่ต้องการตรวจสอบ")
        .setRequired(true)
    );

  await client.application.commands.create(command);
  console.log("✅ Bot is online & command registered");
});

// ====== HANDLE COMMAND ======
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "check") return;

  // ตอบ Discord ทันที กัน error ไม่ตอบสนอง
  await interaction.reply({
    content: "🔍 กำลังตรวจสอบข้อมูล...",
    ephemeral: true
  });

  const name = interaction.options.getString("name");

  try {
    const res = await axios.get(API_URL, {
      params: { name },
      timeout: 15000
    });

    if (res.data.status === "found") {
      await interaction.editReply(
        `✅ พบชื่อ: ${res.data.name}`
      );
    } else {
      await interaction.editReply(
        "❌ ไม่พบชื่อในรายการ"
      );
    }
  } catch (err) {
    await interaction.editReply(
      "⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่"
    );
  }
});

// ====== LOGIN ======
client.login(TOKEN);
