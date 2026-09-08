import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET all creatures with their related habitats and notables
app.get('/api/creatures', async (req, res) => {
  try {
    const creatures = await prisma.creature.findMany({
      include: {
        habitats: {
          include: {
            habitat: true,
          },
        },
        notables: true,
      },
    });
    res.json(creatures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch creatures' });
  }
});

// GET single creature by ID
app.get('/api/creatures/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const creature = await prisma.creature.findUnique({
      where: { id: Number(id) },
      include: {
        habitats: {
          include: {
            habitat: true,
          },
        },
        notables: true,
      },
    });

    if (!creature) {
      res.status(404).json({ error: 'Creature not found' });
      return;
    }

    res.json(creature);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch creature' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🧙‍♂️`);
});
