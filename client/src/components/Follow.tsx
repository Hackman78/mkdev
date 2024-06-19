import React, { ReactElement, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Follow = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [isFollowing, setIsFollowing] = useState(false);

  const follow = () => {
    axios
      .post(`/api/follows/follow/${id}`)
      .then((): void => {
        setIsFollowing(true);
      })
      .catch((err) => console.error(err));
  };

  const unfollow = () => {
    axios
      .delete(`/api/follows/unfollow/${id}`)
      .then((): void => {
        setIsFollowing(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <>
        <button onClick={isFollowing ? unfollow : follow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </>
    </div>
  );
};

export default Follow;
