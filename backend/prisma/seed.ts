import { PrismaClient, Era } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Middle-earth Bestiary data...');

  const angband = await prisma.habitat.upsert({
    where: { name: 'Angband' },
    update: {},
    create: { name: 'Angband', description: 'The ancient underground hell-forge of Morgoth.' },
  });

  const mordor = await prisma.habitat.upsert({
    where: { name: 'Mordor' },
    update: {},
    create: { name: 'Mordor', description: 'The volcanic plateau ruled by Sauron.' },
  });

  const mirkwood = await prisma.habitat.upsert({
    where: { name: 'Mirkwood' },
    update: {},
    create: { name: 'Mirkwood', description: 'Dense, corrupted woodland.' },
  });

  await prisma.creature.upsert({
    where: { name: 'Balrog' },
    update: {},
    create: {
      name: 'Balrog',
      originEra: Era.YEARS_OF_THE_TREES,
      master: 'Morgoth',
      threatLevel: 'Cataclysmic',
      description: 'Demonic beings of shadow and flame, corrupted Maiar who joined Morgoth’s rebellion.',
      notables: {
        create: [
          { name: 'Gothmog', title: 'Lord of Balrogs', status: 'Slain' },
          { name: "Durin's Bane", title: 'Terror of Khazad-dûm', status: 'Slain' },
        ],
      },
      habitats: {
        create: [
          { habitatId: angband.id },
        ],
      },
    },
  });

  await prisma.creature.upsert({
    where: { name: 'Great Spider' },
    update: {},
    create: {
      name: 'Great Spider',
      originEra: Era.YEARS_OF_THE_TREES,
      master: null,
      threatLevel: 'Lethal',
      description: 'Enormous arachnid horrors descended from Ungoliant.',
      notables: {
        create: [
          { name: 'Shelob', title: 'Her Ladyship of Cirith Ungol', status: 'Unknown' },
        ],
      },
      habitats: {
        create: [
          { habitatId: mordor.id },
          { habitatId: mirkwood.id },
        ],
      },
    },
  });

  console.log('Seeding complete! 🧙‍♂️');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
