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
        console.error(err);
        return { error: err };
    }
};

export function quickDOM(tag, innerText = "", className = "", value = "") {
    let newElement;
    if (tag.search('input-') !== -1) {
        const type = tag.split('-')[1];
        newElement = document.createElement('input');
        newElement.type = type;
    } else {
        newElement = document.createElement(tag);
    }
    className && newElement.classList.add(className);
    newElement.innerText = innerText || "";
    newElement.value = value || "";
    return newElement;
}

export const hideElement = element => element.style.display = "none";
export const showElement = element => {
    element.style.display = "block";
    window.scrollTo(0,0);
}


export const clearForm = form => {
    const textInputs = form.querySelectorAll("input[type=text]");
    textInputs.forEach(input => (input.value = ""));
    const textAreas = form.querySelectorAll("textarea");
    textAreas.forEach(area => area.value="");
    const checkBoxes = form.querySelectorAll("input[type=checkbox]");
    checkBoxes.forEach(box => box.checked = false);
};

