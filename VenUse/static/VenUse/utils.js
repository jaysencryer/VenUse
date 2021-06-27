export const fetchApi = async (url, body = {}) => {
    // TODO - fix error reporting
    try {
        const response = await fetch(url, body);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            return {
                error:
                    data.error || `${response.status}:${response.statusText}`,
            };
        }
    } catch (err) {
        console.log(err);
        return { error: err };
    }
};

export function quickDOM(tag, innerText = "", className = "", value = "") {
    const newElement = document.createElement(tag);
    className && newElement.classList.add(className);
    newElement.innerText = innerText || "";
    newElement.value = value || "";
    return newElement;
}


