import React, { useEffect, useState } from 'react';

import abCard from "assets/images/about-01.webp";
import abGlobal from "assets/images/about-global.png";
import abStatistics from "assets/images/about-statistics.png";
import abCollection from "assets/images/about-add-to-collection.png";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from 'react-redux';
import Selectors from 'redux/selectors';
import PersonalPortfolio from "components/personalPortfolio"
import Head from 'next/head';

type PropTypes = {
	location: any,
}
const AboutPage: React.FC<PropTypes> = (props) => {
	const router = useRouter();
	
	const { loggingIn } = useSelector(Selectors.auth);

	const onCreatePersonalPortfolio = () => {
		if (!loggingIn) {
			return router.push('/login')
		}
		router.push("/profile/collections")
	}

	const renderLink = () => {
		if (!loggingIn) return '/login';
		
		return '/profile/collections';
	}
	return (
		<section id="page-resd">
			<Head>
				<title>About | PriceGuide.Cards</title>
				<meta name="description" content="About the services provided by PriceGuide.Cards" />
			</Head>
			<div className="container">
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mt-25 pb-10 mb-80 line-bottom">
                        <li className="breadcrumb-item">
                            <Link href="/">
                                <a title="Home">Home</a>
                            </Link> </li>
						<li className="breadcrumb-item active" aria-current="page"> About </li>
					</ol>
				</nav>
			</div>
			<div className="container">
				<div className="row flex-column-reverse flex-md-row">
					<div className="col-md-6">
						<h1 className="title"> Welcome to PriceGuide.Cards! </h1>
						<div className="content maxw-550 mb-130">
							<p>Launched in 2014, and with data spanning a quarter of a billion recorded card sales, Priceguide.Cards is likely the world's largest database resource for card sales data.</p>
							<p>PriceGuide.cards is consistently ranked No. 1 on Google for searches on soccer card values and among the highest-ranking for searches on baseball and basketball card values.</p>
							<p>The site features 30 million card photographs and covers collections from over 150 Trading Card Publishers.</p>
						</div>
					</div>
					<div className="col-md-6 right-lg">
						<img src={abCard.src} alt="" title="" className="maxw-470 mt-50" />
					</div>
				</div>
			</div>
			<div className="ab-gradient ab-mission">
				<div className="container">
					<div className="row">
						<div className="col-md-4 pl-30">
							<img src={abGlobal.src} alt="" title="" className="" />
							<ul>
								<li>Track and compare card prices</li>
								<li>Interactive Charts</li>
								<li>Customizable analytics</li>
							</ul>
						</div>
						<div className="col-md-4 pl-30">
							<img src={abStatistics.src} alt="" title="" className="" />
							<ul>
								<li>My Portfolio - manage your collection</li>
								<li>Leaderboard</li>
							</ul>
						</div>
						<div className="col-md-4 pl-30">
							<img src={abCollection.src} alt="" title="" className="" />
							<ul className="last">
								<li>Top card sales</li>
								<li>Friends + Message other collectors</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className="ab-number">
				<div className="container">
					<div className="row g-0 statistical">
						<div className="col">
							<div className="text-statistical">250M</div>
							<div className="sub-text-statistical">Recorded Sales Prices</div>
						</div>
						<div className="col">
							<div className="text-statistical">10.5M</div>
							<div className="sub-text-statistical">Cards Featured</div>
						</div>
						<div className="col">
							<div className="text-statistical">135K</div>
							<div className="sub-text-statistical">Active Collectors</div>
						</div>
						<div className="line-bottom"></div>
					</div>
				</div>
			</div>
			<PersonalPortfolio />
		</section>
	);
}

export default AboutPage;