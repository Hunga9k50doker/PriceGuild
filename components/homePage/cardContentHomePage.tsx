import React from "react";
import Link from 'next/link'
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';

type PropTypes = {
  children: React.ReactNode,
  title: string,
  textContent: string,
  textButton: string,
  onClickButton?: () => void
}

const CardContentHomePage = (props: PropTypes) => {

  const { loggingIn } = useSelector(Selectors.auth);

 	const renderLink = () => {
		if (!loggingIn) return '/login';
		
		return '/profile/collections';
  }
  
  return (
    <div className="card-content-home">
      <div className="text-title-content">{props.title}</div>
      <div className="text-content"> {props.textContent}</div>
      {props.children}
      <Link href={renderLink()} >
        <a className="mt-3 btn btn-primary btn-lg">
          {props.textButton}
        </a>
      </Link>
    </div>
  );
}

export default React.memo(CardContentHomePage);


