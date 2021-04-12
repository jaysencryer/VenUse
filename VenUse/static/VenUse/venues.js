document.addEventListener("DOMContentLoaded", () => {
    // When page loads - check for user_id button, and set up profile menu
    const userHub = document.querySelector("#user_name");
    userHub && (userHub.onclick = () => toggleProfileMenu());

    // on manage venue page look allow new venue form to be opened dynamically
    const addVenueButton = document.querySelector("#add_venue");
    addVenueButton && (addVenueButton.onclick = () => showAddVenue());

    // Assign an onclick handler to each venues edit button
    const editVenueButtons = document.querySelectorAll('.edit_venue');
    editVenueButtons && (editVenueButtons.forEach(editVen => editVen.onclick = () => showVenueDetail(editVen.id)));
    
});

const toggleButtons = (buttonArray) => {
    buttonArray.forEach(btn => btn.disabled = !btn.disabled);
}

const toggleProfileMenu = () => {
    const profileMenu = document.querySelector("#profile_menu");
    profileMenu.classList.toggle("show_menu"); 
    profileMenu.querySelector('ul').style.display = profileMenu.querySelector('ul').style.display === 'block' ? 'none' : 'block';
};

const showAddVenue = () => {
    const addVenueForm = document.querySelector('#add_venue_form');
    addVenueForm.style.display = "block";
}

const showAddRoom = () => {
    console.log("Add room clicked");
    const addRoomForm = document.querySelector('#add_room_form');
    addRoomForm.style.display = "block";
}

const showVenueDetail = async (id) => {
    //console.log(`showing details for Venue with id ${id}`);
    const venueDetail = document.querySelector('#venue_detail');
    venueDetail.innerHTML = '';
    venueDetail.style.display = "block";
    // disable edit buttons
    const editVenueButtons = document.querySelectorAll('.edit_venue');
    toggleButtons(editVenueButtons);

    const venElement = await venueDisplay(id);
    venueDetail.append(venElement);
    const closeBtn = document.createElement('button');
    closeBtn.innerText = "Close";
    closeBtn.onclick = () => {
        venueDetail.style.display = "none";
        toggleButtons(editVenueButtons);
    }
    venueDetail.append(closeBtn);
}

const venueDisplay = async id => {
    // fetch the venue(id) data from API, including rooms
    const data = await fetchApi(`/get_venue/${id}`);

    if (data.error){
        return quickDOM("h3",data.error);
    }

    const venueData = data[0];
    const rooms = data[1];
    const container = quickDOM('div','','venue_detail_container');
    const venue = quickDOM('div','','venue_detail_main');
    venue.append(quickDOM('h1',venueData.name));
    venue.append(quickDOM('small', venueData.description));
    if (venueData.address) {
        venue.append(quickDOM('p', `Address: ${venueData.address}`,'venue_detail_add'));
    } else {
        venue.append(quickDOM('p','You have not added an address for this venue yet!','venue_detail_add'));
        venue.append(quickDOM('button','Add Address','venue_detail_add_btn','add_address'));
    }

    const roomDiv = quickDOM('div','','venue_room_detail');
    if (rooms.length > 0){
        // We have rooms configured
        rooms.map(room => roomDiv.append('p', room.name));
    } else {
        roomDiv.append(quickDOM('h3', 'You do not have any rooms configured for this Venue'));
        const addRoomButton = quickDOM('button', 'Add Room', 'venue_detail_add_btn','add_room');
        addRoomButton.id = 'add_room';
        roomDiv.append(addRoomButton);
        roomDiv.querySelector('#add_room').onclick = () => showAddRoom();
    }
    
    container.append(venue);
    container.append(roomDiv);

    return container;
}



const fetchApi = async (url) => {
    // TODO - fix error reporting
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            return {"error":data.error || `${response.status}:${response.statusText}`};
        }
    } catch (err) {
        console.log(err);
        return {"error":err};
    }
}

function quickDOM(tag, innerText = '', className = '', value = ''){
    const newElement = document.createElement(tag);
    className && newElement.classList.add(className);
    newElement.innerText = innerText || '';
    newElement.value = value || '';
    return newElement;
}