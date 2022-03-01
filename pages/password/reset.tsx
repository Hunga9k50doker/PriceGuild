import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "configs/axios";
import { ToastSystem } from "helper/toast_system";
import ConfirmPassword from "components/confirmPassword"
import { useRouter } from 'next/router'
type Inputs = {
  email: string,
};


const ForgotPassword = () => {
    const router = useRouter()
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const query: any = router.query;
	const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('User name is required')
      .email('Please provide a valid email address'),

  });
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>(formOptions);


	const onSubmit: SubmitHandler<Inputs> = async data => {
		setIsLoading(true)
		try {
			const result = await api.v1.account.forgotPassword({ email: data.email });
			if (result.success) {
				setIsLoading(false)
				reset({email: ""})
				return	ToastSystem.success(result.message);
			}
			setIsLoading(false)
			ToastSystem.error(result.message);
		} catch (err) {
			setIsLoading(false)
			console.log(err);
		}
  };

	return (
		<section id="page-resd">
			{(query?.email && query?.token) ? <ConfirmPassword  query={query}/> :
					<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h2 className="title text-center mt-70"> Forgot Password </h2>
							<form onSubmit={handleSubmit(onSubmit)} className="maxw-420">
								<p className="mb-20">You will receive an email with instructions on how to reset your password in a few minutes.</p>
								<div className={`form-group form-data mb-30 ${errors.email ? "error-validation" : ""} `}>
									<label>Email address</label>
									<input {...register("email")} type="text" className="form-control" placeholder="Your e-mail adress" />
									{errors.email?.message && <div className="invalid-feedback d-inline">{errors.email?.message}</div>}
								</div>
								<button disabled={isLoading} type="submit" className="btn btn-primary">
									Reset Password</button>
							</form>
						</div>
					</div>
				</div>
		}
		
			{/* <div className="container">
				<div className="row">
					<div className="col-md-12">
						<h2 className="title text-center mt-70"> New Password </h2>
						<form className="maxw-420">
							<div className="form-group">
								<label>New password</label>
								<input type="text" className="form-control" placeholder="Enter your new password" />
							</div>
							<div className="form-group mb-30">
								<label>Confirm password</label>
								<input type="text" className="form-control" placeholder="Confirm your new password" />
							</div>
							<button type="submit" className="btn btn-primary">Change Password</button>
						</form>
					</div>
				</div>
			</div> */}
		</section>
	);
}

export default ForgotPassword;