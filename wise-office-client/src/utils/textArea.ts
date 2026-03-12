export function autoResizeTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
}
