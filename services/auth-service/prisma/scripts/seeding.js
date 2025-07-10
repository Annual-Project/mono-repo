import prisma from '../../config/db.js';
import AuthUtils from '../../../../shared/utils/AuthUtils.js';

async function main() {
  console.log('Seeding database...');

  // Création des roles
  const roles = await prisma.role.createMany({
    data: [
      { name: 'admin' },
      { name: 'user' },
      { name: 'guest' },
    ],
  });

  console.log(`Created ${roles.count} roles.`);

  // Création des utilisateurs
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'jean.dupont@outlook.fr',
        salt: AuthUtils.generateSalt(),
        password: 'admin',
        firstname: 'Jean',
        lastname: 'Dupont',
      },
      {
        email: 'jean.marie@outlook.fr',
        salt: AuthUtils.generateSalt(),
        password: 'user',
        firstname: 'Jean',
        lastname: 'Marie',
      },
    ],
  });

  console.log(`Created ${users.count} users.`);

  // Association des utilisateurs avec les rôles
  const userRoles = await prisma.userHasRole.createMany({
    data: [
      {
        userId: 1, // Jean Dupont
        roleId: 1, // Admin
      },
      {
        userId: 2, // Jean Marie
        roleId: 2, // User
      },
    ],
  });

  console.log(`Created ${userRoles.count} user roles associations.`);

}

main()
  .then(async () => {
    console.log('Seeding completed.');
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  });

