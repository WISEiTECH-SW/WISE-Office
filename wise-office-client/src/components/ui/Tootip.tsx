import { Info } from "lucide-react";
import { useState } from "react";

type TooltipProps = {
    message: string;
};

export default function Tooltip({ message }: TooltipProps) {
    const [show, setShow] = useState(false);
    const toggle = () => setShow((prev) => !prev);

    return (
        <div
            className="relative flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 cursor-pointer"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onClick={toggle}
        >
            <Info
                width={18}
                height={18}
                className="text-gray-500 hover:text-blue-500"
            />
            {show && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded-md px-2 py-1 shadow-">
                    {message}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                </div>
            )}
        </div>
    );
}
