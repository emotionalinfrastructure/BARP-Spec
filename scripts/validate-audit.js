const fs = require('fs');

function validate(file) {
  const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
  return lines.map((line, index) => {
    try {
      const entry = JSON.parse(line);
      if (!entry.event || !entry.timestamp) {
        throw new Error('Missing required fields');
      }
      return { index, valid: true };
    } catch (error) {
      return { index, valid: false, error: error.message };
    }
  });
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/validate-audit.js <audit-file>');
    process.exit(1);
  }
  console.log(JSON.stringify(validate(file), null, 2));
}

module.exports = { validate };
