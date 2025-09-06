const bcrypt = require("bcryptjs");
require("dotenv").config();
const { query } = require("./src/config/database"); 

async function resetAdminPassword() {
  try {
    const newPassword = "admin123"; 
    const newHash = await bcrypt.hash(newPassword, 10); 

    await query("UPDATE users SET password = $1 WHERE login = $2", [
      newHash,
      "admin",
    ]);

    console.log("Пароль администратора сброшен!");
    console.log(`Новый пароль: ${newPassword}`);
    console.log(`Хеш в БД: ${newHash}`);
  } catch (error) {
    console.error("Ошибка при сбросе пароля:", error);
  }
}

resetAdminPassword();
