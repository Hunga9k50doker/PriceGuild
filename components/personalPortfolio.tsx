import React from 'react';
import PersonalPortfolioImage from "assets/images/personal-portfolio.png";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from "react-redux"
import Selectors from 'redux/selectors';

const PersonalPortfolio: React.FC = () => {

  const router = useRouter();
  
  const { loggingIn } = useSelector(Selectors.auth);

  const onCreatePersonalPortfolio = () => {
    router.push("/profile/collections");
  }
  const renderLink = () => {
    if (!loggingIn) return '/login';
    
    return '/profile/collections';
  }
  
  return (
    <div
      className="personal-portfolio"
      style={{
        backgroundImage: `url(${PersonalPortfolioImage.src})`
      }}
    >
      <div className="title">Create Personal Portfolio</div>
      <div className='sub-title'>Join a worldwide community of card collectors.</div>
      <Link href={renderLink()} >
        <a className="btn btn-light btn-lg">
          Create Personal Portfolio
        </a>
      </Link>
    </div>
  );
}

export default React.memo(PersonalPortfolio);
