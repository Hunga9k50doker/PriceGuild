import React from 'react'
import IconLoading from "assets/images/loading.svg";
import IconWaring from "assets/images/error-sign.svg"

type PropTypes = {
    type: string
}
const Loading = ({type = "loading" , ...props}:PropTypes) => {
    const Message = {
        waring: "Error loading data, please try again later",
        loading: "Getting data"
    }
    return (
        <div className="leader-board-loading">
            <div className={`leader-board-loading__icon ${type === "loading" ? 'leader-board-loading__icon--loading':''}`}>
                <img src={type === "loading"? IconLoading : IconWaring } alt="" />
            </div>
            <div className="leader-board-loading__title">
                {type === "loading" ? Message.loading : Message.waring}
            </div>
        </div>
    )
}

export default Loading
