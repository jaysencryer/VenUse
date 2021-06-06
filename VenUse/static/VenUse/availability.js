import { quickDOM } from './utils.js';

export const slots = [
    "Morning", 
    "Afternoon", 
    "Evening"
];

export const dayOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

export const AVAIL_DEFAULT = {    
    "Monday" :"6",
    "Tuesday": "6",
    "Wednesday": "6",
    "Thursday": "6",
    "Friday": "6",
    "Saturday": "6",
    "Sunday": "6",
};

export const makeAvailForm = (availability = AVAIL_DEFAULT) => {
    const formElement = quickDOM("div","","ven-form");
    const availTable = quickDOM("table");
    
    const headerRow = quickDOM("tr"); 
    headerRow.append(quickDOM("td"));
    slots.forEach((slot) => {
        // Create the Morning, Afternoon Evening headers
        headerRow.append(quickDOM("td",slot));
    });
    
    availTable.append(headerRow);
    dayOfWeek.forEach(day => {
        // create the row for each day, and checkbox for each slot
        const newRow = quickDOM("tr");
        newRow.append(quickDOM("td",day));
        for (let slot = 4 ; slot > 0 ; slot = slot >> 1 ) {
            const checkTD = quickDOM("td");
            const box = document.createElement("input");
            box.type="checkbox";
            // avail works like this, each slot has a binary value morning(4), afternoon(2), evening(1)
            // box is checked if the bit for the slot is set to 1 (hence bitwise AND '&')
            box.checked = parseInt(availability[day]) & parseInt(slot);
            box.name=`${day.slice(0,3).toLowerCase()}_${slot}`;
            checkTD.append(box);
            newRow.append(checkTD);
        }
        availTable.append(newRow);
    });
    
    formElement.append(availTable);
    return formElement;
}

// getAvailability(html node that contains an availability form)
export const getAvailability = async availabilityForm => {
    // get all checked availabilities
    const checks = availabilityForm.querySelectorAll("input[type=checkbox]:checked");
    const avail = {};
    dayOfWeek.forEach(day => {
        for( const checkbox of checks) {
            if (checkbox.name.slice(0,3).toLowerCase() === day.slice(0,3).toLowerCase()) {
                // name ="day_#" e.g. "mon_4", "fri_1"
                // if we already have an availability for the day - convert to int and add it - if not, set it to the 
                // first value we come across.
                avail[day] = avail[day] ? parseInt(avail[day]) + parseInt(checkbox.name[4]) : parseInt(checkbox.name[4]);
            }
        }
        // convert it all to strings
        avail[day] = avail[day] ? `${avail[day]}`: "0";
    });
    return avail;
}
