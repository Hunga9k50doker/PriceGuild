import React, { useEffect, useState } from 'react';

import imgAdvertisement2 from "assets/images/advertisement-sidebar.jpg";
import imgClose2 from "assets/images/cross-black.svg";
import imgSearch from "assets/images/search.svg";

import imgFacebook from "assets/images/icon-facebook.svg";
import imgTwitter from "assets/images/icon-twitter.svg";
import imgLinkedin from "assets/images/icon-linkedin.svg";
import imgCopy from "assets/images/icon-copy-black.svg";

import imgVertical from "assets/images/dots-vertical.svg";
import imgEdit from "assets/images/icon-edit.svg";
import imgDelete from "assets/images/icon-delete.svg";
// import { useParams, useHistory } from 'react-router-dom';
import { useRouter } from 'next/router'
import Link from 'next/link'
import { BlogData } from "interfaces";
import { api } from 'configs/axios';
import moment from "moment";
import Skeleton from 'react-loading-skeleton'

type PropTypes = {
	location: any,
}

type ParamTypes = {
	slug: string,
}

type DataBlogDetail = {
	blog: BlogData,
	archives: Array<string>,
}
const BlogPage: React.FC<PropTypes> = (props) => {

	const [activeClass, setActiveClass] = React.useState<string>("");
	const [dataDetail, setDataDetail] = useState<DataBlogDetail>({
		// @ts-ignore
		blog: {},
		archives: [],
	});
	const router = useRouter();
	const [keySearch, setKeySearch] = React.useState<string | undefined>();
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const getBlogDetail = async (item: string) => { 
		try {
			let param: any = {
				alias: item
			}

			const result = await api.v1.blogs.getBlogDetail(param);
			
			if (result.success) {
				setIsLoading(false)
				setDataDetail(prevState => {
					return {
						...prevState,
						blog: result.data.blog,
						archives: result.data.archives
					}
				})
			}
		} catch (error) {
			setIsLoading(false);
			// @ts-ignore
			setDataDetail(prevState => {
					return {
						...prevState,
						blog: {},
						archives: []
					}
				})
		}
	}
	useEffect(() => {
		// @ts-ignore
		getBlogDetail(router?.query?.slug)
	}, [router?.query])

	const gotoBlogArchives = (item: string) => {
		router.push(`/blog?archive=${item}`)
	}

	const handleChange = (event: any) => {
		setKeySearch(event?.target?.value)
	}
	
	const handleSearch = () => {
		router.push(`/blog?search=${keySearch}`)
	}

	return (
		<section id="page-resd">
			<div className="container">
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mt-25 pb-10 mb-30 line-bottom">
                        <li className="breadcrumb-item">
                            <Link href="/">
                                <a title="Home"> Home </a>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/blog">
                                <a title="Blog">Blog</a>
                            </Link>
                        </li>
						<li className="breadcrumb-item active" aria-current="page"> {dataDetail.blog.title} </li>
					</ol>
				</nav>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-9 position-relative">
						<div className="list-article mt-0 maxw-780">
							<article className="detail">
								{!isLoading ?
									<figure>
										<img src="https://i.imgur.com/hgEKIVA.jpg" alt="" className="img-fluid" />
									</figure>
									:
									<Skeleton style={{ width: '100%', height: 250 }}/>
								}
								<div className="post-content">
									<h1 className="post-title"> {dataDetail?.blog?.title} </h1>
									<div className="entry-meta">
										<span className="post-category">{dataDetail?.blog?.sport}</span>
										<span className="post-by">by {dataDetail?.blog?.created_by}</span>
										<span className="post-on">{moment(new Date(dataDetail?.blog?.created)).format("MMM DD, YYYY")}</span>
									</div>
									<div dangerouslySetInnerHTML={{__html: dataDetail?.blog?.introtext}}>
										{/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc, fringilla at mattis vel. Rhoncus viverra est in consequat, ornare dolor condimentum sed semper. Dignissim consequat, nisi mauris justo eu nibh pellentesque imperdiet. Et mattis orci scelerisque pretium id volutpat. Enim, ut morbi eget dictum fringilla ut mattis in tempor. Tellus urna, arcu ultrices bibendum faucibus. Leo sed fermentum eget feugiat suspendisse enim </p>
										<img src="https://i.imgur.com/MR6wTZ7.jpg" alt="" />
										<p>Vulputate lobortis scelerisque in congue pulvinar pharetra consequat venenatis. Pellentesque sit nisi diam lectus blandit ullamcorper turpis commodo. Et ipsum tortor, vitae consequat nulla. Lacus urna integer eu purus. Nisi, aliquam sed mi leo a egestas pulvinar rhoncus. Nunc amet sit id lacinia sapien cursus in et. Sed tortor, scelerisque habitant quis mauris nisi, enim. In viverra pellentesque porta nibh lacus maecenas. Nisl orci tristique purus vel quis leo quis ornare. Adipiscing ornare curabitur habitant cursus aliquam netus dui. Tortor mauris ipsum sed sed. At nisl sed id egestas montes, et nec pretium dolor. </p> */}
									</div>
								</div>
							</article>
							{!isLoading ? 
								<div className="share-box d-md-flex d-block">
									<div className="entry-meta mb-0">
										<span className="post-category">{dataDetail?.blog?.sport}</span>
										<span className="post-by">by {dataDetail?.blog?.created_by}</span>
										<span className="post-on">{moment(new Date(dataDetail?.blog?.created)).format("MMM DD, YYYY")}</span>
									</div>
									<ul className="social-share">
										<li> <a className="icon-facebook" href="" title="Facebook" target="_blank"> <img src={imgFacebook} alt="Facebook" title="Facebook" /> </a> </li>
										<li> <a className="icon-twitter" href="" title="Twitter" target="_blank"> <img src={imgTwitter} alt="Twitter" title="Twitter" /> </a> </li>
										<li> <a className="icon-linkedin" href="" title="Linkedin" target="_blank"> <img src={imgLinkedin} alt="Linkedin" title="Linkedin" /> </a> </li>
										<li> <a className="icon-copy" href="" title="Copy" target="_blank"> <img src={imgCopy} alt="Copy" title="Copy" /> </a> </li>
									</ul>
								</div>
								: <Skeleton style={{ width: '100%', height: 350 }}/>
							}
							<div className="comments">
								<ul className="media-list">
									<li className="media">
										<img src="https://i.imgur.com/Fb1kSQP.jpg" className="d-none d-sm-block" alt="" />
										<form>
											<div className="form-group">
												<textarea className="form-control" placeholder="Add comment"></textarea>
											</div>
										</form>
									</li>
								</ul>
								<div className="comments-head d-flex d-block">
									<strong>11 comments</strong>
									<div className="btn-group sort">
										<button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false"> Newest </button>
										<ul className="dropdown-menu dropdown-menu-lg-end">
											<li><a href="">item</a></li>
											<li><a href="">item</a></li>
											<li><a href="">item</a></li>
										</ul>
									</div>
								</div>
								<ul className="media-list">
									<li className="media">
										<img src="https://i.imgur.com/Fb1kSQP.jpg" alt="" />
										<div className="media-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor faucibus tortor nibh nisi egestas. Viverra pretium mauris pellentesque imperdiet accumsan nullam vitae, morbi. Duis ultrices neque dis egestas nunc, diam condimentum pellentesque.</p>
											<div className="entry-meta mb-0">
												<span className="post-by">by Den</span>
												<span className="post-on">Aug 30, 2021</span>
											</div>
										</div>
										<div className="dropdown-edit">
											<button className="btn dropdown-toggle" type="button" id="dropdownEdit" data-bs-toggle="dropdown" aria-expanded="false"> <img src={imgVertical} alt="" /> </button>
											<ul className="dropdown-menu dropdown-menu-lg-end" aria-labelledby="dropdownEdit">
												<li><img src={imgEdit} alt="" /> Edit</li>
												<li><img src={imgDelete} alt="" /> Delete</li>
											</ul>
										</div>
									</li>
									<li className="media">
										<img src="https://i.imgur.com/Fb1kSQP.jpg" alt="" />
										<div className="media-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor faucibus tortor nibh nisi egestas. Viverra pretium mauris pellentesque imperdiet accumsan nullam vitae, morbi. Duis ultrices neque dis egestas nunc, diam condimentum pellentesque.</p>
											<div className="entry-meta mb-0">
												<span className="post-by">by Den</span>
												<span className="post-on">Aug 30, 2021</span>
											</div>
										</div>
									</li>
									<li className="media">
										<img src="https://i.imgur.com/Fb1kSQP.jpg" alt="" />
										<div className="media-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor faucibus tortor nibh nisi egestas. Viverra pretium mauris pellentesque imperdiet accumsan nullam vitae, morbi. Duis ultrices neque dis egestas nunc, diam condimentum pellentesque.</p>
											<div className="entry-meta mb-0">
												<span className="post-by">by Den</span>
												<span className="post-on">Aug 30, 2021</span>
											</div>
										</div>
									</li>
									<li className="media">
										<img src="https://i.imgur.com/Fb1kSQP.jpg" alt="" />
										<div className="media-body">
											<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor faucibus tortor nibh nisi egestas. Viverra pretium mauris pellentesque imperdiet accumsan nullam vitae, morbi. Duis ultrices neque dis egestas nunc, diam condimentum pellentesque.</p>
											<div className="entry-meta mb-0">
												<span className="post-by">by Den</span>
												<span className="post-on">Aug 30, 2021</span>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="sidebar">
							<form className="search-form d-none d-md-block" action="" method="get">
								<div className="input-group">
									<button type="button" onClick={() => {handleSearch()}}> <img src={imgSearch} alt="" title="" /> </button>
									<input
										onChange={handleChange}
										type="text"
										className="form-control"
										placeholder="Search"
										value={keySearch}
									/>
									<span className="clear"><img src={imgClose2} alt="Clear" title="Clear" /></span>
								</div>
							</form>
							<div className="tags d-none d-md-block">
								<div className="title"> Tags </div>
								<ul>
									<li> <a href="" title="Cards">Cards</a> </li>
									<li> <a href="" title="Sport">Sport</a> </li>
									<li> <a href="" title="Football">Football</a> </li>
									<li> <a href="" title="Toops">Toops</a> </li>
									<li> <a href="" title="Panini">Panini</a> </li>
									<li> <a href="" title="Tennis">Tennis</a> </li>
									<li> <a href="" title="Basketball">Basketball</a> </li>
								</ul>
							</div>
							<div className="archives">
								<div className="title"> Archives </div>
								<ul>
									{
										dataDetail.archives.map((item, index) => {
											return (
                                                <li key={index} onClick={() => { gotoBlogArchives(item) }}>
                                                    <Link href={'/blog'}>
                                                        <a title={JSON.stringify(item)}>
                                                            {item}
                                                        </a>
                                                    </Link>
                                                </li>
											)
										})
									}
									
								</ul>
							</div>
							<div className="adve">
								<a href="" title="" target="_blank"> <img src={imgAdvertisement2.src} alt="" title="" /> </a>
							</div>	
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default BlogPage;