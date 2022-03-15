import React from "react";
import { SelectDefultType } from "interfaces"


type PropsType = {
  options: Array<SelectDefultType>,
  onChange?: (value: any) => void,
  value?: any, 
  className?: string
}

export type FilterHandle = {
  reset: () => void;
};

const SortMobile = React.forwardRef<FilterHandle, PropsType>(({  ...props }, ref) => {

  return (
    <div>
      {props?.options?.map((option, key) =>
        <div onClick={()=> props.onChange && props.onChange(option)} 
          className={` ${props?.value?.value ===option.value ? "active": ""} ${props?.className || ''} `}
          >
          {option.label}
          </div>
      )}
    </div>
  );
})

export default React.memo(SortMobile);
