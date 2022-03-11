import React, { useEffect, useState } from 'react';
import { MyStorage } from "helper/local_storage";
import { verify } from 'crypto';
import { api } from "configs/axios";
import { ConfigAction } from "redux/actions/config_action";
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router'
import { ToastSystem } from 'helper/toast_system';
import Head from 'next/head';

type PropTypes = {
	location?: any,
}
type ParamTypes = {
	token?: string,
}

const AboutPage: React.FC<PropTypes> = (props) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const {token} = router.query;
	const [dataUser, setDataUser] = useState<any>(null);
	const verifyEmail = async () => {
		try {
			const result = await api.v1.account.setActiveAccount({ email:   MyStorage.user.email });
			if(result.success) {
				ToastSystem.success(result.message);
			} else {
				ToastSystem.error("Login Error!")
			}
		} catch (err) {
		   ToastSystem.error("Login Error!")
	   	}
	}
	useEffect(() => {
		setDataUser(MyStorage.user)
	}, [])
	
	return (
		<>
			<Head>
				<title>Verify Email | PriceGuide.Cards</title>
				<meta name="description" content="" />
			</Head>
			<section id="page-resd">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="contact-notify-success mwidth-420 txt-left mt-65">
								<h2 className="title"> Verify Your Email </h2>
								<p className="mb-1">In order to start using PriceGuide.Cards account, you need to confirm your email address.</p>
								<p className="mb-1">We have sent a confirmation email to:</p>
								<p className="mb-2"><a href="#" onClick={verifyEmail}  title={dataUser?.email}><strong>{ dataUser?.email}</strong></a></p>
								<p className="mb-50">Check your email and click on the confirmation link to continue.</p>
								<p className="mb-3 fz-16">If you haven't received an email with instructions - click on the button below.</p>
								<p> <a href="#" onClick={verifyEmail}  title="Resend Email" className="btn btn-resend">Resend Email</a> </p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default AboutPage;