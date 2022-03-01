import React from 'react'


interface Props {
    bgcolor?: string;
    progress?: number;
    height?: number;
    textAl?: string | undefined; 
}

const Progress_bar = ({bgcolor,progress = 0,height, textAl= 'right'}: Props) => {
     
    const Parentdiv = {
        height: height,
        width: '146px',
        backgroundColor: '#CCCFD6',
        borderRadius: 40,
      }
      
      const Childdiv = {
        width: `${progress}%`,
      }
      
      const progresstext = {
        padding: 10,
        color: 'black',
        fontWeight: 900
      }
        
    return (
    <div style={Parentdiv}>
      <div className='progessBg' style={Childdiv}>
      </div>
    </div>
    )
}
  
export default React.memo(Progress_bar);