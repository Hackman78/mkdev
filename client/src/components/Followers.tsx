import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfile } from '../../../types';
import axios from 'axios';

const Followers = (): ReactElement => {
  const { id } = useParams();
  const [followerData, setFollowerData] = useState<UserProfile[] | null>(null);

  useEffect(() => {
    axios
      .get(`/api/follows/followers/${id}`)
      .then(({ data }): void => {
        setFollowerData(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      {followerData && followerData.length === 0 ? (
        `No Followers`
      ) : (
        <ul>
          {followerData &&
            followerData.map((follower) => (
              <li key={follower.id}>{follower.name}</li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Followers;
