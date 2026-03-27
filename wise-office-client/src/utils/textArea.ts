/**
 * ChangeEvent 발생 시 호출되는 래퍼 함수
 */
export function autoResizeTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}

/**
 * HTMLTextAreaElement의 높이를 내용에 맞게 조절
 */
export function resizeTextarea(element: HTMLTextAreaElement) {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
}
