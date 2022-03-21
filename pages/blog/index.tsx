import React, { useEffect, useState } from 'react';

import imgAdvertisement2 from "assets/images/advertisement-sidebar.jpg";
import imgClose from "assets/images/cross-gray.svg";
import imgClose2 from "assets/images/cross-black.svg";
import imgSearch from "assets/images/search.svg";
import imgHidSearch from "assets/images/hidden-search.svg";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { BlogData } from "interfaces";
import { useDebouncedCallback } from "utils/useDebouncedEffect"
import { api } from 'configs/axios';
import Skeleton from 'react-loading-skeleton'
import Pagination from "components/panigation";
import moment from "moment";
import { isFirefox } from "utils/helper"
import Head from 'next/head';
// @ts-ignore
import $ from "jquery"
import queryString from 'query-string';

type PropTypes = {
	location: any,
}
type DataLoadType = {
	blogs: Array<BlogData>;
	archives: Array<number>;
	isLoading: boolean;
	rows?: number;
};
const rowsPerPage = 20;

type DataBlogDetail = {
	blog: BlogData,
	archives: Array<string>,
}

const BlogPage: React.FC<PropTypes> = (props) => {

	const [activeClass, setActiveClass] = React.useState<string>("");
	const [data, setData] = useState<DataLoadType>({
		blogs: [],
		archives: [],
		isLoading: true,
		rows: 0,
	});
	const [keySearch, setKeySearch] = React.useState<string | undefined>();
	const [pagesSelected, setPagesSelected] = useState<Array<number>>([1]);
	const [archive, setArchive] = useState<number | undefined>(undefined);
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const router = useRouter();
	const [dataDetail, setDataDetail] = useState<DataBlogDetail>({
		// @ts-ignore
		blog: {},
		archives: [],
	});
	useEffect(() => {
		getBlogList([1]);
	}, [])

	const query: any = router?.query
	// const [dataTable, setDataTable] = useState<Array<BlogData>>([]);
	const getBlogList = async (page: Array<number> = [1], keySearchState: string | undefined = undefined) => {
		try {
			setData(prevState => {
				return { ...prevState, blogs: page.length === 1 ? [] : [...prevState.blogs],isLoading: true }
			})
			let params: any = {
				search_term: keySearchState ?? keySearch,
				page: page[page.length-1],
				limit: rowsPerPage,
			}

			if (archive !== undefined) {
				params['archive'] = new Number(archive)
			}
			// getblogList
			const result = await api.v1.blogs.getblogList(params);
			if (result.success) {
				setShowDetail(false);
				if (page.length === 1) { 
					return setData({
						blogs: result.data.blogs,
						isLoading: false,
						archives: result.data.archives,
						rows: result.rows,
					})
				}
				return setData(prevState => {
					return {
						...prevState,
						blogs: [...prevState.blogs, ...result.data.blogs],
						isLoading: false,
						archives: result.data.archives,
						rows: result.rows
					};
				});
			}
			return setData({
				blogs: [],
				archives: [],
				isLoading: false,
				rows: 0,
			});
		} catch (error) {
			console.log(error);
			setData((prevState) => {
				return { ...prevState, isLoading: false };
			});
		}
	}
	const loadResultBlog = useDebouncedCallback(getBlogList, 450);

	const handleChange = (event: any) => {
		setKeySearch(event?.target?.value)
		
		loadResultBlog(pagesSelected, event?.target?.value)
	}
	const clearSearch = () => {
		if (query?.search) {
			router?.replace(`/blog`)
		}
		setKeySearch('');
	}

	const onLoadMore = () => {
		if (pagesSelected[pagesSelected.length-1] + 1 <= (Math.ceil((data.rows ?? 0) / rowsPerPage))) {
		getBlogList([...pagesSelected, pagesSelected[pagesSelected.length-1]+1])
		setPagesSelected([...pagesSelected, pagesSelected[pagesSelected.length-1]+1])
		}
	}

		var timerid: any = null;
  	const handlePageClick = (event: any) => {
		if (event.length === 1) {
      isFirefox ? $('html, body').animate({scrollTop: 0}) : window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    if (timerid) {
      clearTimeout(timerid);
		}
		timerid = setTimeout(() => {
			setPagesSelected(event)
			getBlogList(event)
    }, 550);
	}
	
	useEffect(() => {
		getBlogList([1]);
	}, [archive])
	
	useEffect(() => {
		getBlogList([1], '');
	}, [keySearch])

	useEffect(() => {
		if (query?.archive) {
			setArchive(query?.archive)
		}

		if (query?.search) {
			setKeySearch(query?.search)
		}
	},[query])

	const showLatestBreadcrumb = () => {
		if (archive !== undefined) return `Archive ${archive}`;

		return 'Searched results';
	}

	const gotoBlogDetail = (alias: string) => {
		router.push(`/blog/detail/${alias}`);
	}

	return (
		<section id="page-resd">
			<Head>
				<title>Blog | PriceGuide.Cards</title>
				<meta name="description" content="Check out the PriceGuide.Cards blog for the latest updates on the website." />
			</Head>
			<div className="container">
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mt-25 pb-10 mb-30 line-bottom">
						<li className="breadcrumb-item">
							<Link href="/">
								<a title="Home">Home</a>
							</Link>
						</li>
						<li className={`breadcrumb-item ${!archive && 'active'}`}> {archive ?
							<Link href="/blog">
								<a title="Blog" onClick={() => { setArchive(undefined); setShowDetail(false) }}>Blog</a>
							</Link> : 'Blog'}
						</li>
						{archive && <li className="breadcrumb-item active" aria-current="page"> {showLatestBreadcrumb()} </li>}
					</ol>
				</nav>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-md-9 position-relative">
							<div className="hidden-search">
							<span className="btn-show" onClick={()=>setActiveClass('active')}> <img src={imgHidSearch} alt="" /> </span>
							<div className={`box ${activeClass}`}>
								<form className="search-form" action="" method="get">
									<div className="input-group">
										<button type="submit"> <img src={imgSearch} alt="" title="" /> </button>
										<input
											onChange={handleChange}
											type="text"
											className="form-control"
											placeholder="Search"
											value={keySearch}
										/>
										{keySearch !== '' && <span className="clear" onClick={() => { clearSearch() }}><img src={imgClose2} alt="Clear" title="Clear" /></span>}
									</div>
								</form>
								<span className="btn-hide" onClick={()=>setActiveClass('')}>close</span>
									<div className="tags">
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
								</div>
							</div>
							<h1 className="title mb-2"> {archive !== undefined ? `Archive ${archive}` : 'Blog'} </h1>
							{keySearch ? <div className="meta-post">Search for <strong>{ keySearch }</strong> <span className="close" title="Clear" onClick={() => clearSearch()}>Clear <img src={imgClose} alt="Clear" title="Clear" /></span></div>: ''}
							<div className="meta-post"><strong>{ data?.rows}</strong> articles</div>
							<div className="list-article">
								{data?.blogs?.map((item, index) => {
									return (
										<article onClick={() => {gotoBlogDetail(item.alias)}}>
											<div className="d-md-flex d-block" key={index}>
												<div className="post-thumb d-flex">
													<a className="" href="" title=""> <img src="https://i.imgur.com/K8N9iIi.jpg" alt="" /> </a>
												</div>
												<div className="post-content">
                                                    <h5 className="post-title mb-15 text-limit-2-row">
                                                        <Link href={`/blog/detail/${item?.alias}`} >
                                                            <a title={item.title}>
                                                                {item.title}
                                                            </a></Link>
                                                    </h5>
													<div className="entry-meta">
														<span className="post-category">{item.sport}</span>
														<span className="post-by">by {item.created_by}</span>
														<span className="post-on">{moment(new Date(item.created)).format("MMM DD, YYYY")}</span>
													</div>
													<p className="post-exerpt"  >{item.metadesc}</p>
													<a className="btn-link" href="" title="Read more">Read more</a>
												</div>
											</div>
										</article>
									)
								})}
								{data.isLoading ?
									<>
										<div className='mt-2 mb-2'>
											<Skeleton style={{ width: '100%', height: 250 }} />
										</div><div className='mt-2 mb-2'>
											<Skeleton style={{ width: '100%', height: 250 }} />
										</div><div className='mt-2 mb-2'>
											<Skeleton style={{ width: '100%', height: 250 }} />
										</div><div className='mt-2 mb-2'>
											<Skeleton style={{ width: '100%', height: 250 }} />
										</div>
									</>
								: ''}	
									
								{
									!data.isLoading && data.blogs.length === 0 && <article className="not-found">
									<p>No results found</p>
										<p> <a href="" title="" className="btn btn-primary" onClick={() => { clearSearch(); loadResultBlog([1], '')}}>Back to All Articles</a> </p>
									</article>
								}
								
								
								{!data.isLoading && Boolean(data?.rows) && (
									<>
										{
											
										Boolean(pagesSelected[pagesSelected.length - 1] < (Math.ceil(
											(data?.rows ?? 0) / rowsPerPage
										)))  && (
										<div className="d-flex justify-content-center">
											<button
											onClick={onLoadMore}
											type="button"
											className="btn btn-light load-more"
											>
											Load More
											</button>
										</div>
										)
										}
										<div className="d-flex justify-content-center mt-3 pagination-page">
											<Pagination
											pagesSelected={pagesSelected}
											onSelectPage={handlePageClick}
											totalPage={Math.ceil(
												(data?.rows ?? 0) / rowsPerPage
											)}
											/>
										</div>
									</>
								)}	
							</div>
						
					</div>
					<div className="col-md-3">
						<div className="sidebar">
							<form className="search-form d-none d-md-block" action="" method="get">
								<div className="input-group">
									<button type="submit"> <img src={imgSearch} alt="" title="" /> </button>
									<input
										onChange={handleChange}
										type="text"
										className="form-control"
										placeholder="Search"
										value={keySearch}
									/>
									{keySearch && <span className="clear" onClick={() => { clearSearch() }}><img src={imgClose2} alt="Clear" title="Clear" /></span>}
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
									{ data.archives.map((item, key) => {
										return (
                                            <li key={key} onClick={() => { setArchive(item) }}>
                                                <Link href={'/blog'}>
                                                    <a title={JSON.stringify(item)}>
                                                        {item}
                                                    </a>
                                                </Link>
                                            </li>
										)
									})}
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