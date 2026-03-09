import { useState } from "react";
import PreviewModal from "@/components/modal/PreviewModal";

export default function Overview() {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => {
        setIsOpen(true);
    };

    const onClose = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <button
                onClick={onOpen}
                className="border border-gray-300 p-2 cursor-pointer"
            >
                미리보기 버튼
            </button>
            {isOpen && <PreviewModal onClose={onClose} />}
        </div>
    );
}
