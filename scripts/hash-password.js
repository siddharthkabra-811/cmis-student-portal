/**
 * Utility script to hash passwords for student accounts
 * Usage: node scripts/hash-password.js <password>
 * Example: node scripts/hash-password.js student123
 */

const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  if (!password) {
    console.error('Error: Password is required');
    console.log('Usage: node scripts/hash-password.js <password>');
    process.exit(1);
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('\nHashed Password:');
    console.log(hashedPassword);
    console.log('\nYou can use this in your SQL update statement:');
    console.log(`UPDATE students SET password = '${hashedPassword}' WHERE email = 'student@tamu.edu';`);
  } catch (error) {
    console.error('Error hashing password:', error);
    process.exit(1);
  }
}

const password = process.argv[2];
hashPassword(password);

