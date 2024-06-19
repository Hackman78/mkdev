import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { PostWithRelations } from "../../../types";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import MarkDown from "./MarkDown";
import RepoDisplay from "./RepoDisplay";

import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';


const FullPost = ():React.ReactElement => {

  const { id } = useParams();
  const [content, setContent]: [PostWithRelations | null, Function] = useState(null);
  const contentREF = useRef(content);
  const [like, setLike] = useState(false);

  const handleLike = () => {
    setLike(!like);
  }


  useEffect(() => {
    axios.get(`/api/posts/${id}`)
      .then(({data}) => {
        setContent(data);
      })
  }, [contentREF])

  try {
    return (
      <>
        <Box sx={{display:"flex", flexDirection:'row', marginLeft: 1, marginTop: 1, alignItems: 'center'}}>
          <Link to={`/user/${content!.author.id}/profile`}>
            <Avatar alt={content!.author.username!} src={content!.author.picture!}>
              {'?'}
              </Avatar>
          </Link>
          <Typography variant="h1" sx={{fontSize: 20, marginLeft: 2, marginRight: 2}}>{content!.author.username || content!.author.name}</Typography>
          <Typography variant="body2" sx={{color: 'lightgrey'}}>{dayjs(content!.createdAt).fromNow()}</Typography>
          <IconButton aria-label='Like' onClick={handleLike}>
            {like ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        <Box sx={{display:"flex", flexDirection:'column', marginLeft: 2}}>
          <MarkDown text={content!.title} />
          <MarkDown text={content!.body} />
        </Box>
        <Box>
          <RepoDisplay content={content!.repo} />
        </Box>
      </>
    )
  }
  catch (err) {
    console.error(err);
    return <></>
  }
}

export default FullPost;