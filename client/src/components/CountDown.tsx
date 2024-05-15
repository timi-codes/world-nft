import React from 'react';


//flex text-xs p-2 items-center justify-between bg-[#27282B] border border-[0.5] border-[#2F3033] rounded-full w-8 h-8
const CountDown = () => { 
    return (
        <div className='flex space-x-2'>
            <div className='text-sm opacity-60'>03d : 06h : 03m : 20s</div>
        </div>
    )
} 

export default CountDown;