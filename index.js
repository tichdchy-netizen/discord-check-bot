const { Client, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

const TOKEN = process.env.TOKEN;
const API_URL = process.env.API_URL;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
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
  console.log("Bot is online");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "check") return;

  await interaction.deferReply();

  const name = interaction.options.getString("name");

  try {
    const res = await axios.get(API_URL, {
      params: { name },
      timeout: 5000,
    });

    if (res.data.status === "found") {
      await interaction.editReply(`พบชื่อ: ${res.data.name}`);
    } else {
      await interaction.editReply("❌ ไม่พบชื่อในรายการ");
    }
  } catch (err) {
    await interaction.editReply("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
  }
});

client.login(TOKEN);
