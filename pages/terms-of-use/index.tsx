import React from 'react';
import Link from 'next/link'
import Head from 'next/head';

type PropTypes = {
	location: any,
}
const AboutPage: React.FC<PropTypes> = (props) => {

	return (
		<section id="page-resd">
			<Head>
				<title>Terms of Use | PriceGuide.Cards</title>
				<meta name="description" content="Terms of Use for PriceGuide.Cards and related mobile applications." />
			</Head>
			<div className="container">
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mt-25 pb-10 mb-80 line-bottom">
						<li className="breadcrumb-item">
							<Link href="/">
								<a title="Home"> Home </a>
							</Link>
						</li>
						<li className="breadcrumb-item active" aria-current="page"> Terms of Use </li>
					</ol>
				</nav>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<h2 className="title txt-left-mob mb-50"> Terms of Use </h2>
						<div className="entry-content maxw-750">
							<div className="questions"> Terms &amp; conditions </div>
							<p>Terms &amp; conditions: PriceGuide.Cards is a free service provided as a guide for sports card collectors showing the trends of secondary market trading values. By using this website you agree to accept and be bound by the terms and conditions of these Terms of Service. The terms and conditions may be changed at any time without notice and will be effective upon posting of the revisions therefore please review our Terms from time to time. Please do not continue to use this website if you do not agree to any terms at any stage.</p>
							<p>This service is intended as a guide only indicating the trends of trading card sales prices and is for the individual collector and their personal card collections and not for use commercially. Information provided is based solely on actual recorded online sales and the website aims to display these factual statistics in an easy to read format. Content on the Websites, and/or any related mobile applications are provided solely for personal research purposes. Except for content posted by you, you may not copy or sell any content appearing on or through our services. The use of automated systems or software to extract data from this website is prohibited. In the best interests of protecting the content of this service and other contributors, unusual or suspicious activity may result in an account block.</p>
							<p>
								<Link href="/privacy-policy">
									<a title="Privacy Policy"> Privacy Policy </a>
								</Link> : When you register you will also be asked to choose a log in and password. Any personal information you choose to disclose such as your contact details and posts is at your sole risk (PriceGuide.Cards recommends that you do not disclose your personal or contact details through posts).</p>
							<p>You may not post or link to any item which is not respectful to the religious beliefs of others, race or gender, or which is pornographic, false, defamatory, harassing, derogatory or offensive or that is an infringement of third party intellectual property rights and PriceGuide.Cards reserves the right to remove or edit any content or post that is deemed objectionable. You agree not to take any action that would interfere with site operations including spam or posting advertisements. Posting links that take users outside of our website for commercial purposes is not allowed including links to auction sites or retail sites. Threads and posts may not contain links to outside sites unless placed by PriceGuides.Cards itself. PriceGuide.Cards does not sell or buy products. The content of posts are solely the opinion and responsibility of the person posting the message and you agree to indemnify and hold us harmless with respect to any claim resulting from post(s) made on this website. Offering items for sale on this website is prohibited. By posting any content, you grant us permission to use, edit, modify, or copy the content submitted. If you submit unsolicited suggestions or ideas, no compensation will be provided to you and you waive any claims if the unsolicited suggestion or idea is used by us or any third party.</p>
							<p>PriceGuide.Cards does not guarantee or promise any results from use of the services which are provided solely as an indicator of trends. PriceGuide.Cards is not responsible for any incorrect or inaccurate content posted on this website or in connection with the services provided. It is not possible to know whether any third party information or data from which this service draws details from is complete or accurate. In the event of any anomaly or omission or error contained in the information presented in this website you agree to indemnify and hold PriceGuide.Cards harmless from any claims or damages of any kind and whether arising in tort or other. Disclaimer: Whilst PriceGuide.Cards has taken all reasonable care in the preparation of the contents of this site, this site is provided on an "as is" basis. The services presented on this website are provided on the understanding that they do not violate any regulations or laws. PriceGuide.Cards are not responsible for the content, accuracy or opinions expressed on this website. Inclusion of any linked website does not imply approval or endorsement of the linked website by PriceGuide.Cards. PriceGuide.Cards assumes no responsibility for any error, omission, interruption, delay in operation or transmission, communications failure and is not responsible for any problems relating to computer systems, servers or providers, computer equipment, software or other services due to technical problems or internet connections. The website contains content presentation generated by <a href="https://www.highcharts.com/" target="_blank" title="Highsoft AS javascript library">Highsoft AS javascript library</a> and our understanding is that except where otherwise noted content on this site and works contained herein are licensed under a Creative Commons Attribution 3.0 International licence. PriceGuide.Cards shall not be responsible for any loss or damage resulting from use of the services, from any content posted on or through the services, or from the conduct of any other users of the service, whether online or offline. PriceGuide.Cards will not be liable for any indirect, consequential or other damages including financial loss arising from your use of this website or the service. Use of this website is at your own risk.</p>
							<p>Trademarks, patents etc: Names, products, designs, information and technology described on the website are widely protected by trademarks, patents, design rights etc owned by PriceGuide.Cards or by others. Nothing contained in these terms shall be construed as conferring any right to use any trademark, patent, design right or copyright of PriceGuide.Cards or of any third party.</p>
							<p>If any provision of this Terms of Service Agreement shall be deemed unlawful or for any reason unenforceable, then that provision is understood to be severable from these terms and conditions and shall not affect the validity of any of the remaining provisions. Content is provided in good faith and in the event of any deficiency or other issue please contact PriceGuide.Cards who will make all reasonable efforts to rectify the problem. PriceGuide.Cards has sole discretion to terminate these Terms and Conditions and services without notice and for any reason. If you wish to contact us please email <a href="mailto:info@priceguide.cards" title="info@priceguide.cards">info@priceguide.cards</a> and we will be pleased to help.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default AboutPage;