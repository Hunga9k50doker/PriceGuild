import React, {useRef, useEffect, useState} from 'react';
import useWindowDimensions from "utils/useWindowDimensions";

interface Props {
    totalPage: number;

    /**Các page selected phải liền kề nhau */
    pagesSelected: number[];

    onSelectPage: (pages: number[]) => void;
}

type ValueShow = number | 'dotted';

const WIDTH_ITEM = 50;
const MARGIN_HORIZONTAL = 10;


const Pagination = ({ totalPage, pagesSelected, onSelectPage}: Props) => {
    const [maxItems, setMaxItems] = useState<number>(8)
    const { width } = useWindowDimensions();
    const stageCanvasRef = useRef(null);
    const [startPage, setStartPage] = useState<number>(1);

    useEffect(() => {
        if (width < 768) {
            setMaxItems(5);
        }
    },[width])

    /**
     * Case 1: Hiển thị full pages
     * 
     * Case 2: Hiển thị số page tối, kèm theo các dấu chấm
     * 
     * Case 3: Khi đang chọn các page ở khoảng giữa thì xuất hiện page cuối và đầu, kèm các dấu chấm
     */
    const getValues = (): Array<ValueShow> => {

        let m = Math.floor(maxItems / 2);

        if(totalPage <= maxItems ) {
            return Array.from({length: totalPage}, (_k, index) => index + 1);
        }

        if(startPage <= m + 1) {
            /// Trừ 1 cho ... và 1 cho page cuối
            return [...Array.from({length: maxItems - 2}, (_k, index) => index + 1), 'dotted', totalPage];
        }

        if(startPage > totalPage - m) {
            /// Trừ 1 cho ... và 1 cho page đầu
            return [1, 'dotted', ...Array.from({length: maxItems - 2}, (_k, index) => index + 1 + (totalPage - (maxItems - 2)))];
        }



        let initPage = startPage - Math.floor((maxItems - 4)/2);
        return [1, 'dotted', ...Array.from({length: maxItems - 4}, (_k, index) => initPage + index)  ,'dotted', totalPage];
    }

    const onPressPage = (num: number) => {
        if(pagesSelected.includes(num)) {
            return
        }
        
        setStartPage(num);
        ///Case length === 1
        if(pagesSelected.length === 0) {
            return onSelectPage([num]);
        }

        ///Case length === 1
        if(pagesSelected.length === 1) {
            // if(pagesSelected[0] === num - 1) {
            //     return onSelectPage([...pagesSelected, num]);
            // }
    
            // if(num + 1 === pagesSelected[0]) {
            //     return onSelectPage([num, ...pagesSelected]);
            // }

            return onSelectPage([num]);
        }

        ///Case length > 1

        return onSelectPage([num]);

        if(pagesSelected[pagesSelected.length - 1] === num - 1) {
            return onSelectPage([...pagesSelected, num]);
        }

        if(num + 1 === pagesSelected[0]) {
            return onSelectPage([num, ...pagesSelected]);
        }

        if(pagesSelected[pagesSelected.length - 1] + 1 < num || num < pagesSelected[0] - 1) {
            return onSelectPage([num])
        }
        return onSelectPage([num])
    }

    const nextPage = () => {
        if(pagesSelected[pagesSelected.length - 1] < totalPage) {
            onPressPage(pagesSelected[pagesSelected.length - 1] + 1);
        }
    };

    const previousPage = () => {
        if(pagesSelected[0] > 1) {
            onPressPage(pagesSelected[0] - 1);
        }
    };

    useEffect(() => {
        if (pagesSelected.length) {
            setStartPage(pagesSelected[pagesSelected.length-1])
        }
    }, []);
    
    return (
        <>
            {getValues().length > 1 && 
                <div className="stage-canvas pagination" ref={stageCanvasRef} style={{ flexDirection: 'row' }}>
                    <li onClick={previousPage} className={`page-item ${startPage > 1 ?"": "disabled"} `}>
                        <a className="page-link " tabIndex={-1} role="button" aria-disabled="true" aria-label="Previous page" rel="prev">
                        <svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.7026 11.003L12.6419 18.9424L10.5206 21.0637L0.459961 11.003L10.5206 0.942383L12.6419 3.0637L4.7026 11.003Z" fill="#124DE3"/>
                        </svg>
                        </a>
                    </li>
                    {/* <button onClick={previousPage}>Back</button> */}
                    {getValues().map((item, index)  => {
                        return typeof item === 'number' ? <ButtonItem  key={item} isSelected={pagesSelected.includes(item)} onClick={() => onPressPage(item)} focusing={startPage} num={item} /> : <span key={`dotted_${index}`}>...</span>;
                    })}
                    <li onClick={nextPage} className={`page-item ${startPage < totalPage ? "": "disabled"} `}>
                        <a className="page-link" tabIndex={0} role="button" aria-disabled="false" aria-label="Next page" rel="next">
                        <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.80933 11.003L0.869995 3.0637L2.99132 0.942383L13.052 11.003L2.99132 21.0637L0.869995 18.9424L8.80933 11.003Z" fill="#124DE3"/>
                        </svg>
                        </a>
                    </li>

                {/* <button >Next</button> */}
                </div>
            }
        </>
    );
}

export default React.memo(Pagination);


interface PropButtonItem {
    focusing: number; 
    num: number; 
    onClick: () => void;
    isSelected: boolean;
}
const ButtonItem = ({num, onClick, focusing, isSelected}: PropButtonItem) => {
    return <li onClick={onClick} className={`page-item  ${isSelected ? "active" :""}`}>
        <a rel="canonical" role="button" className="page-link" tabIndex={-1} aria-label={`Page ${num} is your current page`} aria-current="page">
        {num}
        </a>
</li>

    
    // <button  style={{ marginLeft: MARGIN_HORIZONTAL, marginRight: MARGIN_HORIZONTAL, width: WIDTH_ITEM, textDecoration: focusing === num ? 'underline' : 'none', color: isSelected ? 'blue' : 'black' }}>
    //     {num}
    // </button>
  }