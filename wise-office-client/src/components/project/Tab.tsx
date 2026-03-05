import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TabProps {
    options: string[];
    selectedTab: string;
    onTabChange: (tab: string) => void;
}

export default function Tab({ options, selectedTab, onTabChange }: TabProps) {
    return (
        <div className="flex w-full bg-gray-100 p-1 rounded-full">
            {options.map((item) => {
                const isActive = selectedTab === item;

                return (
                    <button
                        key={item}
                        onClick={() => onTabChange(item)}
                        className={`
                            flex-1 py-2 rounded-full text-sm transition-all duration-200
                            ${
                                isActive
                                    ? "bg-blue-600 text-white font-semibold shadow-sm"
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
