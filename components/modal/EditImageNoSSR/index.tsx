// @ts-ignore
import ImageEditor from '@toast-ui/react-image-editor';
import "tui-image-editor/dist/tui-image-editor.css";
import React, { useState } from "react";

const icona = require("tui-image-editor/dist/svg/icon-a.svg");
const iconb = require("tui-image-editor/dist/svg/icon-b.svg");
const iconc = require("tui-image-editor/dist/svg/icon-c.svg");
const icond = require("tui-image-editor/dist/svg/icon-d.svg");
const theme = {
    "menu.backgroundColor": "#FFFFFF",
    "common.backgroundColor": "#FFFFFF",
    "downloadButton.backgroundColor": "#FFFFFF",
    "downloadButton.borderColor": "#FFFFFF",
    "downloadButton.color": "#FFFFFF",
    "menu.normalIcon.path": icond,
    "menu.activeIcon.path": iconb,
    "menu.disabledIcon.path": icona,
    "menu.hoverIcon.path": iconc,
};

type ImageEditorInstType = {
    toDataURL: (value: any) => void

}
type FilterHandle = {
    imageEditorInst: ImageEditorInstType
}

type PropTypes = {
    src: any,
    refParam: FilterHandle,
    onGetImage: (value: any) => void
}
const CustomImageEditor = ({ src = "img/sampleImage.jpg", ...props }: PropTypes) => {
    const imageEditorRef = React.useRef<FilterHandle>(null);
    console.log(imageEditorRef, "imageEditorRefimageEditorRefimageEditorRef")
    React.useEffect(() => {
        if (imageEditorRef) {
            props.onGetImage && props.onGetImage(imageEditorRef?.current?.imageEditorInst);
        }
    }, [imageEditorRef])
    return (
        <>
            {src.length && typeof window !== "undefined" ?
                <ImageEditor
                    includeUI={{
                        loadImage: {
                            path: src,
                            name: "SampleImage",
                        },
                        theme: theme,
                        menu: ["crop", "flip", "rotate", "draw", "shape", "text", "filter"],
                        initMenu: "",
                        uiSize: {
                            height: "550px",
                        },
                        menuBarPosition: "bottom",
                    }}
                    // cssMaxWidth={1000}
                    cssMaxHeight={500}
                    selectionStyle={{
                        cornerSize: 20,
                        rotatingPointOffset: 70,
                    }}
                    usageStatistics={true}
                    ref={imageEditorRef}
                /> : <></>


            }
        </>
    );
};

export default CustomImageEditor;
