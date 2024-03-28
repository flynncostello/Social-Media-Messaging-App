import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import userAPI from '../../../api/user';

const Friend = ({ friendId }) => {
  const [friendDetails, setFriendDetails] = useState(null);

  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const friendData = await userAPI.getUser(friendId);
        setFriendDetails(friendData);
      } catch (error) {
        console.error('Error fetching friend details:', error);
      }
    };

    fetchFriendDetails();
  }, [friendId]);

  return (
    <div className="friend-badge">
      {friendDetails ? (
        <>
          <FontAwesomeIcon icon={faUser} />
          <span>{friendDetails.username}</span>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Friend;