import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link'
import * as Yup from 'yup';
import { RegexString } from 'utils/constant';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from 'configs/axios';
import HCaptcha from '@hcaptcha/react-hcaptcha';

type Inputs = {
	name: string,
	email: string,
	subject: string,
	message: string,
};
type PropTypes = {
	location: any,
}
const AboutPage: React.FC<PropTypes> = (props) => {

	const [token, setToken] = useState(null);
  const captchaRef = useRef(null);
  const onLoad = () => {
    // @ts-ignore
    captchaRef.current.execute();
	};
	
	const [isSubmit, setIsSubmit] = useState<boolean>(false);
	const validationSchema = Yup.object().shape({
		email: Yup.string()
		  .matches(RegexString.userOrEmail, 'Please provide a valid email address')
		  .required('Email is required'),
	});

	const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>({
	resolver: yupResolver(validationSchema),
	mode: 'onChange'
	});

	const onSubmit: SubmitHandler<Inputs> = async data => {
		try {
			const headers = { "captcha-token": token };
			setIsSubmit(true);
			const result = await api.v1.other_API.contact_us(data, headers);
			if (result.success) {
				reset({
					name: "",
					email: "",
					subject: "",
					message: "",
				})
			}
		}
		catch (err) {}
	
	};

  React.useEffect(() => {
    if (isSubmit) { 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },[isSubmit])

	return (
		<section id="page-resd">
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
						<li className="breadcrumb-item active" aria-current="page"> Contact </li>
					</ol>
				</nav>
			</div>
			<div className="container">
				{isSubmit ? <div className="row">
						<div className="col-md-12">
							<div className="contact-notify-success">
								<h2 className="title"> Message sent </h2>
								<p className="mb-50">Thank you for your message. We will respond as soon as possible, thank you for your patience.</p>
								<p> <button onClick={()=> setIsSubmit(false)} title="Send New Message" className="btn">Send New Message</button> </p>
							</div>
						</div>
					</div> :<div className="row">
					<div className="col-md-12">
						<h1 className="title txt-left-mob"> Contact </h1>
						<form className="maxw-555" onSubmit={handleSubmit(onSubmit)}>
							<p className="mb-20">Please send us your suggestions, comments or questions.</p>
							<div className="form-group">
								<label>Name</label>
								<input {...register("name")} name="name"  type="text" className="form-control" placeholder="Your name" />
							</div>
								<div className={`form-group form-data ${errors.email ? "error-validation" : ""}`}>
								<label>Email address</label>
								<input {...register("email")} name="email"type="email" className="form-control" placeholder="Your e-mail adress" />
								{errors.email?.message && <div className="invalid-feedback d-inline">{errors.email?.message}</div>}
							</div>
							<div className="form-group">
								<label>Subject</label>
								<input {...register("subject")} name="subject" type="text" className="form-control" placeholder="Subject" />
							</div>
							<div className="form-group mb-30">
								<label>Message</label>
								<textarea  {...register("message")} name="message" className="form-control" placeholder="Your message"></textarea>
								</div>
								<div className="form-group mb-30">
								<HCaptcha
                sitekey={`${process.env.REACT_APP_SITE_KEY}`}
               // onLoad={onLoad}
                // @ts-ignore
                onVerify={setToken}
								ref={captchaRef}
								onExpire={() => {
									setToken(null)
									/// @ts-ignore
									captchaRef.current.resetCaptcha();
								}}
             />
								</div>
							
							<button disabled={!token} type="submit" className="btn btn-primary">Send Message</button>
						</form>
					</div>
				</div>  }
			</div>
		</section>
	);
}

export default AboutPage;