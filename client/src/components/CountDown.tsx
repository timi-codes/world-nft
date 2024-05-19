import React, { useState, useEffect } from 'react';

interface CountdownProps {
    startDate: string;
    endDate: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ startDate, endDate }) => {
    const calculateTimeLeft = (): TimeLeft => {
        const now = new Date();
        const end = new Date(endDate);
        const start = new Date(startDate);

        const totalDuration = end.getTime() - start.getTime();
        const timePassed = now.getTime() - start.getTime();
        const timeLeft = totalDuration - timePassed;

        if (timeLeft <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        const seconds = Math.floor((timeLeft / 1000) % 60);
        const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
        const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

        return { days, hours, minutes, seconds };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [startDate, endDate]);

    const pad = (num: number): string => {
        return String(num).padStart(2, '0');
    };

    return (
        <div className='flex space-x-1 text-center'>
            {timeLeft.days > 0 && <span className="inline-block w-9 text-[12px] opacity-60">{pad(timeLeft.days)}d :</span>}
            <span className="inline-block w-8 text-[12px] opacity-60">{pad(timeLeft.hours)}h :</span>
            <span className="inline-block w-8 text-[12px] opacity-60">{pad(timeLeft.minutes)}m :</span>
            <span className="inline-block w-5 text-[12px] opacity-60">{pad(timeLeft.seconds)}s</span>
        </div>
    );
};

export default Countdown;