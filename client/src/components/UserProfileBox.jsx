import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfileBox = ({ userId }) => {
  console.log('UserProfileBox is called');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    axios.get('/api/user', {
      params: {
        user_id: userId,
      },
    })
      .then((response) => {
        console.log('response: ', response);
        setUserInfo(response.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="user-profile-box">
      {userInfo && (
      <div>
        <img className="your-img" src={userInfo.photo_url} alt="user" />
        <h3 className="your-company">{userInfo.company_name}</h3>
        <span className="greeting">
          Hello,
          {userInfo.username}
          !
        </span>
      </div>
      )}
    </div>
  );
};

export default UserProfileBox;
