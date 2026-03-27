import React from "react";

interface TabProps {
    options: string[];
    selectedTab: string;
    onTabChange: (tab: string) => void;
}

export default function Tab({ options, selectedTab, onTabChange }: TabProps) {
    const activeIndex = options.indexOf(selectedTab);

    return (
        <div className="relative flex w-full bg-gray-100 p-1 rounded-full">
            <div
                className="absolute top-1 bottom-1 left-1 bg-blue-600 rounded-full transition-all duration-300"
                style={{
                    width: `calc((100% - 8px) / ${options.length})`,
                    transform: `translateX(${activeIndex * 100}%)`,
                }}
            />

            {options.map((item) => {
                const isActive = selectedTab === item;

                return (
                    <button
                        key={item}
                        onClick={() => onTabChange(item)}
                        className={`
                            relative z-10 flex-1 py-2 text-sm rounded-full transition-colors cursor-pointer
                            ${
                                isActive
                                    ? "text-white font-semibold"
                                    : "text-gray-500 hover:text-gray-700"
                            }
                        `}
                    >
                        {item}
                    </button>
                );
            })}
        </div>
    );
}
