// Sets a new admin password. The password is typed at a hidden prompt, never stored
// in a file, never printed. It must be at least 14 characters.
// Run: node prisma/set-admin-password.js
const readline = require("readline");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@adymarketplace.test";
const MIN_LENGTH = 14;

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = function (str) {
      // Show the question, hide everything the user types.
      if (str.includes(question)) rl.output.write(str);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function main() {
  const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!user) {
    console.error(`No account found for ${ADMIN_EMAIL}.`);
    process.exit(1);
  }
  if (user.role !== "ADMIN") {
    console.error(`${ADMIN_EMAIL} is not an admin account. Nothing changed.`);
    process.exit(1);
  }

  const first = await askHidden(`New password for ${ADMIN_EMAIL} (${MIN_LENGTH}+ characters): `);
  if (first.length < MIN_LENGTH) {
    console.error(`Too short. Use at least ${MIN_LENGTH} characters. Nothing changed.`);
    process.exit(1);
  }
  const second = await askHidden("Type it again: ");
  if (first !== second) {
    console.error("The two entries do not match. Nothing changed.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(first, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  console.log("Done. The admin password is changed. Log in with the new password.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
