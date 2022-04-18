import React, { useEffect, useRef } from 'react'
import CardPhotoBase from "assets/images/Card Photo Base.svg";
type PropTypes = {
    url?: string,
    className?: string
    imgError?: string
}

const LazyLoadImg = ({ url, className = "", imgError, ...props }: PropTypes) => {
    const imgRef = useRef<any>();

    useEffect(() => {
        const img = imgRef.current;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                img.setAttribute("src", url)
            }
        })

        if (img) observer.observe(img)

        return () => {
            if (img) observer.unobserve(img)
        }
    }, [])


    return (

        <img className={className}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = imgError || CardPhotoBase;
            }} 
            alt="" 
            ref={imgRef}
            title="" 
        />
    )
}

export default LazyLoadImg