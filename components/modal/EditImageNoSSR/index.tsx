// @ts-ignore
import ImageEditor from '@toast-ui/react-image-editor';
import "tui-image-editor/dist/tui-image-editor.css";

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
  
type PropTypes = {
    src: any,
    ref: any
}
const CustomImageEditor = ( {src ="", ...props }: PropTypes) => {
    console.log(props,"propspropsprops")
  return (
    <ImageEditor
      includeUI={{
        loadImage: {
          path: "img/sampleImage.jpg",
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
    />
  );
};

export default CustomImageEditor;
