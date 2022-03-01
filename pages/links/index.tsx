import React, { useEffect, useState } from 'react';

import imgLink from "assets/images/icon-link.svg";
import imgCopy from "assets/images/icon-copy.svg";
import imgLinks01 from "assets/images/links-01.jpg";
import imgLinks02 from "assets/images/links-02.jpg";
import imgLinks03 from "assets/images/links-03.jpg";
import imgLinks04 from "assets/images/links-04.jpg";
import imgLinks05 from "assets/images/links-05.jpg";
import imgLinks06 from "assets/images/links-06.jpg";
import imgAdvertisement from "assets/images/advertisement.webp";

type PropTypes = {
	location: any,
}
const AboutPage: React.FC<PropTypes> = (props) => {

	return (
		<section id="page-resd">
			<div className="container">
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mt-25 pb-10 mb-80 line-bottom">
						<li className="breadcrumb-item"> <a href="#" title="Home"> Home </a> </li>
						<li className="breadcrumb-item active" aria-current="page"> Links </li>
					</ol>
				</nav>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-xs-12">
						<h2 className="title text-left"> Recommended sites </h2>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-3">
						<div className="links-site text-center">
							<img src={imgLinks01.src} alt="FCF" title="" />
							<a href="#" target="_blank" title="FCF">FCF <img src={imgLink} alt="" title="" className="" /></a>
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-3">
						<div className="links-site text-center">
							<img src={imgLinks02.src} alt="PackWar" title="" />
							<a href="#" target="_blank" title="PackWar">PackWar <img src={imgLink} alt="" title="" className="" /></a>
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-3">
						<div className="links-site text-center">
							<img src={imgLinks03.src} alt="Baseball Card" title="" />
							<a href="#" target="_blank" title="Baseball Card">Baseball Card <img src={imgLink} alt="" title="" className="" /></a>
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-3">
						<div className="links-site text-center">
							<img src={imgLinks04.src} alt="Main Entrance Sports" title="" />
							<a href="#" target="_blank" title="Main Entrance Sports">Main Entrance Sports <img src={imgLink} alt="" title="" className="" /></a>
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-3">
						<div className="links-site text-center">
							<img src={imgLinks05.src} alt="Football Cartophilic Info" title="" />
							<a href="#" target="_blank" title="Football Cartophilic Info">Football Cartophilic Info <img src={imgLink} alt="" title="" className="" /></a>
						</div>
					</div>
					<div className="col-xs-12 col-sm-6 col-md-3">
						<div className="links-site text-center">
							<img src={imgLinks06.src} alt="Sport Cards Europe" title="" />
							<a href="#" target="_blank" title="Sport Cards Europe">Sport Cards Europe <img src={imgLink} alt="" title="" className="" /></a>
						</div>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="share-card">
							<h4>Share PriceGuide.Cards on your site!</h4>
							<img src={imgAdvertisement.src} alt="" title="" />
							<div className="input-group">
								<input type="text" className="form-control" value="&lt;a href=&quot;https://www.priceguide.cards/en&quot; target=&quot;_blank&quot;&gt;&lt;img" />
								<button className="btn"> <img src={imgCopy} alt="" title="" /> </button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<h4 className="title-sm txt-left-mob"> Request to add your site to PriceGuide.Cards </h4>
						<form className="maxw-555">
							<div className="form-group">
								<label>Your Email</label>
								<input type="email" className="form-control" placeholder="Your e-mail adress" />
							</div>
							<div className="form-group">
								<label>Website Link</label>
								<input type="text" className="form-control" placeholder="ex: http://www.google.com" />
							</div>
							<div className="form-group mb-30">
								<label>Message</label>
								<textarea className="form-control" placeholder="Your message"></textarea>
							</div>
							<button type="submit" className="btn btn-primary">Send Request</button>
						</form>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="contact-notify-success">
							<h2 className="title"> Request sent </h2>
							<p className="mb-50">Thanks for your request, our manager will connect with you soon.</p>
							<p> <a href="#" title="Send New Message" className="btn">Send New Request</a> </p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default AboutPage;