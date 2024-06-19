import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const users = Router();
const prisma = new PrismaClient();

// Authenticated route to verify a user is logged in
users.get('/loggedIn', (req: any, res: any) => {
  const user = req.user;
  if (req.isAuthenticated()) {
    res.send({id: user.id});
  } else {
    res.send({id: 0})
    console.error('Please Log in');
  }
});

//Get user profile
users.get(
  '/:id/profile',
  async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ): Promise<void> => {
    try {
      const userProfile = await prisma.user.findUniqueOrThrow({
        where: { id: +req.params.id },
        include: {
          tags: true,
          posts: {
            include: {
              author: true,
              tags: true,
              repo: true,
              liked: { select: { id: true } },
            },
          },
          blogs: true,
        },
      });
      res.send(userProfile);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    } finally {
      await prisma.$disconnect();
    }
  }
);

// Get user by id
users.get('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: +id },
    });
    res.status(200).send(user);
  } catch (err) {
    console.error('Failed to get user:', err);
    res.sendStatus(500);
  } finally {
    await prisma.$disconnect();
  }
});

// get all users
users.get('/', (req: any, res: any) => {
  prisma.user
    .findMany()
    .then((users: {}[]) => {
      res.send(users);
    })
    .catch((err: { name: string }) => {
      console.error(err);
      res.sendStatus(500);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
});

// Update user by id
users.patch('/:id', async (req: any, res: any) => {
  const { id } = req.params;
  const { devId, username, githubId, linkedinId } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: +id },
      data: { devId, username, githubId, linkedinId },
    });
    res.status(200).send(user);
  } catch (err) {
    console.error('Failed to update user:', err);
    res.sendStatus(500);
  } finally {
    await prisma.$disconnect();
  }
});

export default users;
