import { Router } from 'express';
import { PostWithRelations } from '../../../types';
import { PrismaClient } from '@prisma/client';
import awsS3Upload from '../../helpers/aws-s3-upload';
// to remove the maintenance warning in the console...
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const posts = Router();
const prisma = new PrismaClient();

// add a post to logged in user
posts.post('/', async (req: any, res: any) => {
  //image in files & title and body in body
  const { title, body } = req.body;
  const repoObj: {
    link: string;
    files: { path: string; contents: string }[];
  } | null = req.body.repo ? JSON.parse(atob(req.body.repo)) : null;
  try {
    let post;
    if (req.files && req.files.img) {
      const s3Obj = await awsS3Upload(req.files.img);
      post = await prisma.post.create({
        data: {
          title,
          body,
          s3_Etag: s3Obj.ETag,
          author: { connect: { id: req.user.id } },
        },
      });
    } else {
      post = await prisma.post.create({
        data: {
          title,
          body,
          author: { connect: { id: req.user.id } },
        },
      });
    }
    if (repoObj) {
      await prisma.repo.create({
        data: {
          post: { connect: { id: post.id } },
          link: repoObj.link,
          files: {
            create: repoObj.files,
          },
        },
      });
    }
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  } finally {
    await prisma.$disconnect();
  }
});

// get all users posts
posts.get('/', (req: any, res: any) => {
  // console.log(req.user);

  prisma.post
    .findMany({ where: { userId: req.user.id } })
    .then((posts: {}[]) => {
      res.send(posts);
    })
    .catch((err: { name: string }) => {
      console.error(err);
      res.sendStatus(500);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
});

// get certain post
posts.get('/:id', (req: any, res: any) => {
  const { id }: { id: string } = req.params;
  prisma.post
    .findFirstOrThrow({ where: { id: +id }, include: {author: true, tags: true, repo: {include: {files: true}}} })
    .then((value: PostWithRelations) => {
      res.send(value);
    })
    .catch((err: { name: string }) => {
      console.error(err);
      if (err.name === 'NotFoundError') {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
});


// update post
posts.patch('/:id', (req: any, res: any) => {
  const { title, body }: { title: string; body: string } = req.body.newPost;
  const { id }: { id: string } = req.params;
  prisma.post
    .update({
      where: { id: +id },
      data: {
        title,
        body,
      },
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: { name: string }) => {
      console.error(err);
      res.sendStatus(500);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
});

// delete post
posts.delete('/:id', (req: any, res: any) => {
  const { id }: { id: string } = req.params;
  prisma.post
    .delete({ where: { userId: req.user.id, id: +id } })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: { name: string }) => {
      console.error(err);
      if (err.name === 'PrismaClientKnownRequestError') {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
});

export default posts;
