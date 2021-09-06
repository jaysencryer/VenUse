export const fetchApi = async (url, body = {}) => {
    try {
        const response = await fetch(url, body);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            return {
                error:
                    data.error ?? `${response.status}:${response.statusText}`,
            };
        }
    } catch (err) {
        return { error: err };
    }
};

export function quickDOM(tag, innerText = "", className = "", value = "") {
    let newElement;
    if (tag.search("input-") !== -1) {
        const type = tag.split("-")[1];
        newElement = document.createElement("input");
        newElement.type = type;
    } else {
        newElement = document.createElement(tag);
    }
    className && newElement.classList.add(className);
    newElement.innerText = innerText || "";
    newElement.value = value || "";
    return newElement;
}

export const hideElement = element => (element.style.display = "none");
export const showElement = element => {
    element.style.display = "block";
    window.scrollTo(0, 0);
};

export const clearForm = form => {
    const textInputs = form.querySelectorAll("input[type=text]");
    textInputs.forEach(input => (input.value = ""));
    const textAreas = form.querySelectorAll("textarea");
    textAreas.forEach(area => (area.value = ""));
    const checkBoxes = form.querySelectorAll("input[type=checkbox]");
    checkBoxes.forEach(box => (box.checked = false));
    const numberInputs = form.querySelectorAll("input[type=number]");
    numberInputs.forEach(input => (input.value = ""));
};

export const showBookedSlots = slots => {
    // converts the numeric value for the slots to the text, Morning, Afternoon, Evening.
    let slotCount = slots;
    let bookingText = "";
    if (slots & 4) {
        bookingText += "Morning";
        slotCount -= slots & 4;
        bookingText += slotCount > 0 ? ", " : "";
    }
    if (slots & 2) {
        bookingText += "Afternoon";
        slotCount -= slots & 2;
        bookingText += slotCount > 0 ? ", " : "";
    }
    if (slots & 1) {
        bookingText += "Evening";
    }
    bookingText += '.';
    return bookingText;
};
