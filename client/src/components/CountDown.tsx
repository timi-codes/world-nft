import React from 'react';

const CountDown = () => { 
    return (
        <div className='flex space-x-2'>
            <div className='flex text-xs p-2 items-center justify-between bg-[#27282B] border border-[0.5] border-[#2F3033] rounded-full w-8 h-8'>3d</div>
            <div className='flex text-xs p-2 items-center justify-between bg-[#27282B] border border-[0.5] border-[#2F3033] rounded-full w-8 h-8'>6h</div>
            <div className='flex text-xs p-2 items-center justify-between bg-[#27282B] border border-[0.5] border-[#2F3033] rounded-full w-8 h-8'>3m</div>
            <div className='flex text-xs p-2 items-center justify-between bg-[#27282B] border border-[0.5] border-[#2F3033] rounded-full w-8 h-8'>2s</div>
        </div>
    )
} 

export default CountDown;