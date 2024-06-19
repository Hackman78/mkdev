import { User, Post, Tags, Blog, Repo, File } from '@prisma/client';

export interface UserProfile extends User {
  posts: PostWithRelations[];
  tags: Tags[];
  blogs: Blog[];
  followedBy: User[];
  following: User[];
}

export interface PostWithRelations extends Post {
  author: User;
  tags: Tags[];
  repo: RepoWithFiles | null;
}

export interface RepoWithFiles extends Repo {
  files: File[]
}
