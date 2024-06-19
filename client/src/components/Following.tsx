import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserProfile } from '../../../types';

const Following = (): React.ReactElement => {
  const { id } = useParams();
  const [followingData, setFollowingData]: [UserProfile[] | null, Function] =
    useState<UserProfile[] | null>(null);

  useEffect(() => {
    axios.get(`/api/follows/following/${id}`).then(({ data }) => {
      setFollowingData(data);
    });
  }, [id]);

  return (
    <div>
      {followingData && followingData.length === 0 ? (
        `Not following any Developers`
      ) : (
        <ul>
          {followingData &&
            followingData.map((following) => (
              <li key={following.id}>{following.name}</li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Following;
