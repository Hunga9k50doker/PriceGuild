import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head';

type PropTypes = {
	location: any,
}
const AboutPage: React.FC<PropTypes> = (props) => {
	let router = useRouter();
	return (
		<section id="page-resd">
			<Head>
				<title>Privacy Policy | PriceGuide.Cards</title>
				<meta name="description" content="Privacy Policy of PriceGuide.Cards and related mobile applications." />
			</Head>
			<div className="container">
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mt-25 pb-10 mb-80 line-bottom">
						<li className="breadcrumb-item">
							<Link href="/" >
								<a title="Home">
									Home
								</a>
							</Link>
						</li>
						<li className="breadcrumb-item active" aria-current="page"> Privacy Policy </li>
					</ol>
				</nav>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-3 d-none d-md-block">
						<div className="sidebar-left">
							<ul>
								<li> <a href="#information-collection" title="Information Collection">Information Collection</a> </li>
								<li> <a href="#information-usage" title="Information Usage">Information Usage</a> </li>
								<li> <a href="#information-protection" title="Information Protection">Information Protection</a> </li>
								<li> <a href="#cookie-usage" title="Cookie Usage">Cookie Usage</a> </li>
								<li> <a href="#3rd-party-disclosure" title="3rd Party Disclosure">3rd Party Disclosure</a> </li>
								<li> <a href="#3rd-party-links" title="3rd Party Links">3rd Party Links</a> </li>
								<li> <a href="#google-adsense" title="Google AdSense">Google AdSense</a> </li>
								<li> <a href="#fai-information-practices" title="Fair Information Practices">Fair Information Practices</a>
									<ul>
										<li> <a href="#fair-information" title="Fair information">Fair information</a> </li>
										<li> <a href="#practices" title="Practices">Practices</a> </li>
									</ul>
								</li>
								<li> <a href="#coppa" title="COPPA">COPPA</a> </li>
								<li> <a href="#caloppa" title="CalOPPA">CalOPPA</a> </li>
								<li> <a href="#our-contact-information" title="Our Contact Information">Our Contact Information</a> </li>
							</ul>
						</div>
					</div>
					<div className="col-md-9">
						<h2 className="title text-left"> Privacy Policy </h2>
						<div className="entry-content">
							<p>This privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.</p>
							<h4 id="information-collection">What personal information do we collect from the people that visit our blog, website or app?</h4>
							<p>When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address or other details to help you with your experience.</p>
							<h4>When do we collect information?</h4>
							<p>We collect information from you when you register on our site, subscribe to a newsletter or enter information on our site.</p>
							<h4 id="information-usage">How do we use your information?</h4>
							<p className="mb-0">We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:</p>
							<ul>
								<li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
								<li>To improve our website in order to better serve you.</li>
								<li>To allow us to better service you in responding to your customer service requests.</li>
								<li>To send periodic emails regarding your order or other products and services.</li>
							</ul>
							<h4 id="information-protection">How do we protect your information?</h4>
							<p>We only provide articles and information. We never ask for credit card numbers. <br />We use regular Malware Scanning.</p>
							<p>Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.</p>
							<p>We implement a variety of security measures when a user places an order enters, submits, or accesses their information to maintain the safety of your personal information.</p>
							<p>All transactions are processed through a gateway provider and are not stored or processed on our servers.</p>
							<h4>How can you delete your data?</h4>
							<p>Users can delete their account by heading to the
								<Link href="/profile/settings/confidentiality">
									<a target="_blank" title="account administation page">
										account administation page
									</a>
								</Link>. After requesting to delete your account users have a 30 day window within which to re-activate their account, after this time period has passed all user data is automatically deleted from the PriceGuide.Cards servers.</p>
							<h4 id="cookie-usage">Do we use "cookies"?</h4>
							<p>Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
							<h4>We use cookies to:</h4>
							<ul>
								<li>Understand and save user's preferences for future visits.</li>
								<li>Keep track of advertisements.</li>
								<li>Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future. We may also use trusted third-party services that track this information on our behalf.</li>
							</ul>
							<p>You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since browser is a little different, look at your browser's Help Menu to learn the correct way to modify your cookies.</p>
							<p>If you turn cookies off, some of the features that make your site experience more efficient may not function properly.</p>
							<h4 id="3rd-party-disclosure">Third-party disclosure</h4>
							<p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when it's release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property or safety.</p>
							<p>However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.</p>
							<h4 id="3rd-party-links">Third-party links</h4>
							<p>Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.</p>
							<h4 id="google-adsense">Google</h4>
							<p>Google's advertising requirements can be summed up by Google's Advertising Principles. They are put in place to provide a positive experience for users. <a href="https://support.google.com/adwordspolicy/answer/1316548?hl=en" target="_blank" title="https://support.google.com/adwordspolicy/answer/1316548?hl=en">https://support.google.com/adwordspolicy/answer/1316548?hl=en</a></p>
							<p>We use Google AdSense Advertising on our website.</p>
							<p>Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.</p>
							<h4>We have implemented the following:</h4>
							<ul>
								<li>Remarketing with Google AdSense</li>
								<li>Google Display Network Impression Reporting</li>
								<li>Demographics and Interests Reporting</li>
								<li>DoubleClick Platform Integration</li>
							</ul>
							<p>We, along with third-party vendors such as Google use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) or other third-party identifiers together to compile data regarding user interactions with ad impressions and other ad service functions as they relate to our website.</p>
							<h4>Opting out:</h4>
							<p>Users can set preferences for how Google advertises to you using the Google Ad Settings page. Alternatively, you can opt out by visiting the Network Advertising Initiative Opt Out page or by using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" title="Google Analytics Opt Out Browser add on">Google Analytics Opt Out Browser add on</a></p>
							<h4 id="caloppa">California Online Privacy Protection Act</h4>
							<p>CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law's reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared. - See more at: <a href="http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf" target="_blank" title="http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf">http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf</a></p>
							<h4>According to CalOPPA, we agree to the following:</h4>
							<p>Users can visit our site anonymously. <br />Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website.<br />Our Privacy Policy link includes the word 'Privacy' and can easily be found on the page specified above.</p>
							<p className="mb-0">You will be notified of any Privacy Policy changes:</p>
							<ul>
								<li>On our Privacy Policy Page</li>
							</ul>
							<p className="mb-0">Can change your personal information:</p>
							<ul>
								<li>By logging in to your account</li>
							</ul>
							<h4>How does our site handle Do Not Track signals?</h4>
							<p>We honor Do Not Track signals and Do Not Track or plant cookies when a Do Not Track (DNT) browser mechanism is in place.</p>
							<h4>Does our site allow third-party behavioral tracking?</h4>
							<p>It's also important to note that we allow third-party behavioral tracking</p>
							<h4 id="coppa">COPPA (Children Online Privacy Protection Act)</h4>
							<p>When it comes to the collection of personal information from children under the age of 13 years old, the Children's Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, United States' consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online.</p>
							<p>We do not specifically market to children under the age of 13 years old.</p>
							<h4 id="fai-information-practices">Fair Information Practices</h4>
							<p id="fair-information">The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.</p>
							<h4 id="practices">In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:</h4>
							<p className="mb-0">We will notify you via email</p>
							<ul>
								<li>Within 7 business days</li>
							</ul>
							<h4>CAN SPAM Act</h4>
							<p>The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.</p>
							<h4>We collect your email address in order to:</h4>
							<ul>
								<li>Market to our mailing list or continue to send emails to our clients after the original transaction has occurred.</li>
							</ul>
							<h4>To be in accordance with CANSPAM, we agree to the following:</h4>
							<ul>
								<li>Not use false or misleading subjects or email addresses.</li>
								<li>Identify the message as an advertisement in some reasonable way.</li>
								<li>Include the physical address of our business or site headquarters.</li>
								<li>Monitor third-party email marketing services for compliance, if one is used.</li>
								<li>Honor opt-out/unsubscribe requests quickly.</li>
								<li>Allow users to unsubscribe by using the link at the bottom of each email.</li>
							</ul>
							<h4>If at any time you would like to unsubscribe from receiving future emails, you can:</h4>
							<ul>
								<li>Follow the instructions at the bottom of each email.</li>
							</ul>
							<p>and we will promptly remove you from <strong>ALL</strong> correspondence.</p>
							<h4 id="our-contact-information">Contacting Us</h4>
							<p>If there are any questions regarding this privacy policy, you may contact us using the information below. <br /><a href="mailto:info@priceguide.cards" title="info@priceguide.cards">info@priceguide.cards</a></p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default AboutPage;