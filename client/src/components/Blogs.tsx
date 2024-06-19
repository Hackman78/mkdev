import React, { useState, ReactElement, useEffect } from 'react';
import axios from 'axios';
import { User } from '@prisma/client';

import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

interface Blog {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string;
}
interface UserProps {
  devId: string;
}

const Blogs = ({ devId }: UserProps): ReactElement => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`https://dev.to/api/articles?username=${devId}&per_page=6`)
      .then(({ data }) => {
        setBlogs(data);
      })
      .catch((err) => console.error('Failed to get blogs:', err));
  }, [devId]);

  return (
    <div>
      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Grid item key={blog.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component='img'
                height='140'
                image={blog.cover_image}
                alt={blog.title}
              />
              <CardContent>
                <Typography variant='h5' component='h2'>
                  <a href={blog.url}>{blog.title}</a>
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {blog.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Blogs;
