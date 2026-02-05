import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
    thickness?: number;
};

const StarBorder = <T extends React.ElementType = 'button'>({
    as,
    className = '',
    color = 'white',
    speed = '6s',
    thickness = 1,
    children,
    ...rest
}: StarBorderProps<T>) => {
    const Component = as || 'button';

    return (
        <Component
            className={`relative inline-block rounded-[20px] border border-white/10 bg-white/5 backdrop-blur-xl text-white text-center text-[16px] py-[16px] px-[26px] ${className}`}
            {...(rest as any)}
        >
            {children}
        </Component>
    );
};

export default StarBorder;
