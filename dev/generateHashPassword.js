require('dotenv').config();
const { hashSync } = require('bcrypt');

// Validación de argumentos
const password = process.argv[2];
if (!password) {
    console.error(
        '❌ Error: Debe proporcionar una contraseña como argumento.\nEjemplo: node script.js SecurePassword@123',
    );
    process.exit(1);
}

// Validación de SALT_ROUNDS
const saltRounds = Number(process.env.SALT_ROUNDS);
if (isNaN(saltRounds) || saltRounds < 1) {
    console.error(
        '❌ Error: SALT_ROUNDS debe estar definido en el archivo .env y debe ser un número válido mayor a 0.',
    );
    process.exit(1);
}

// Generación del hash
try {
    const hashedPassword = hashSync(password, saltRounds);
    console.log('✅ Contraseña hasheada:');
    console.log(hashedPassword);
} catch (error) {
    console.error('❌ Error al hashear la contraseña:', error.message);
    process.exit(1);
}
