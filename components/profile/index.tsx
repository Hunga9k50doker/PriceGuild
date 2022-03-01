import React from 'react';
import Personal from "components/profile/personal"

const Profile: React.FC = () => {

  return (
    <div className="container">
      <div className="row">
        <div className="col-2 p-2 border-end pt-5">
          <div className="profile-menu">
            <div className="title-menu active"> Profile </div>
            <div className="title-menu"> Collections </div>
            <div className="title-menu"> Wishlists </div>
            <div className="title-menu"> Friends </div>
            <div className="title-menu"> Messages </div>
            <div className="title-menu"> Market </div>
            <hr />
            <div className="title-menu"> Settings </div>
            <div className="title-menu"> Can't find a card? </div>
            <div className="title-menu"> API </div>
          </div>
        </div>
        <Personal />
      </div>
    </div>
  );
}

export default React.memo(Profile);
