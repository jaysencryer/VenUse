import{ quickDOM, fetchApi } from './utils.js';
import { makeAvailForm,getAvailability } from './availability.js';

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
    const addVenueDiv = document.querySelector('#add_venue_form');
    addVenueDiv.style.display = "block";
    const addVenueForm = addVenueDiv.querySelector('#venue_form');
    addVenueForm.querySelector("#id_name").focus();
    addVenueForm.onsubmit = () => {
        addVenue(addVenueForm);
        addVenueDiv.style.display = "none";
        return false;
    }
}

const showAddRoom = (venId, roomObject = null) => {
    // console.log(`Add room clicked for venue ${venId}`);
    const addRoomDiv = document.querySelector('#add_room_form');
    addRoomDiv.style.display = "block";
    const availForm = addRoomDiv.querySelector('#avail_form');
    availForm.innerHTML=''; // Clear any lingering availabilities
    availForm.append(makeAvailForm(roomObject ? roomObject.availability : undefined));
    const addRoomForm = addRoomDiv.querySelector('#room_form');

    if (roomObject) {
        // We are editing an existing room
        addRoomForm.querySelector('#id_name').value = roomObject.name;
        addRoomForm.querySelector('#id_description').value = roomObject.description;
        addRoomForm.querySelector('#id_capacity').value = roomObject.capacity;
    }
    
    addRoomForm.querySelector("#id_name").focus();
    addRoomForm.onsubmit = () => {
        // Form completed - add the room to the database
        // or if there's a room object update it
        addRoom(addRoomForm, venId, roomObject ? roomObject.id : undefined);
        
        return false;
    }
}




const addRoom = async (roomForm, venId, roomId = null) => {
    let roomName = roomForm.querySelector('#id_name').value;
    let roomDescription = roomForm.querySelector('#id_description').value;
    let roomCapacity = roomForm.querySelector('#id_capacity').value;
    let roomAvailability = await getAvailability(roomForm.querySelector('#avail_form'));
    // console.log(roomAvailability);
    // console.log(`adding room named : ${roomName}, ${roomDescription} capacity: ${roomCapacity} to venue id ${venId}`);

    const apiMethod = roomId ? 'PUT' : 'POST';  // If we have a room Id already we are updating the info
    const data = await fetchApi('/add_room',{
        method: apiMethod,
        body: JSON.stringify ({
            room_id: roomId,
            venue_id: venId,
            name: roomName,
            description: roomDescription,
            capacity: roomCapacity,
            availability: roomAvailability,
        })
    });
    // clear the form once we're happy update has happened.
    // console.log(data);
    if (!("error" in data)){
        roomForm.querySelector('#id_name').value = '';
        roomForm.querySelector('#id_description').value = '';
        roomForm.querySelector('#id_capacity').value = '';
        roomForm.querySelector('#avail_form').innerHTML = '';
        // Hide the form        
        document.querySelector('#add_room_form').style.display = "none";
        // update the edit view
        showVenueDetail(venId);
    }
    
    return false;
}

const addVenue = async venueForm => {
    let venueName = venueForm.querySelector('#id_name').value;
    let venueUrl = venueForm.querySelector('#id_url').value;
    let venueDescription = venueForm.querySelector('#id_description').value;
    const data = await fetchApi('/add_venue',{
        method:'POST',
        body: JSON.stringify ({
            name: venueName,
            url: venueUrl,
            description: venueDescription,
        })
    });
    // console.log(data);

    // clear the form
    venueForm.querySelector('#id_name').value = '';
    venueForm.querySelector('#id_url').value = '';
    venueForm.querySelector('#id_description').value = '';
    // update the main view

    return false;
}

const showVenueDetail = async (id) => {
    //console.log(`showing details for Venue with id ${id}`);
    const venueDetail = document.querySelector('#venue_detail');
    venueDetail.innerHTML = '';
    venueDetail.style.display = "block";
    // disable edit buttons
    const editVenueButtons = document.querySelectorAll('.edit_venue');
    if (!editVenueButtons[0].disabled) {
        toggleButtons(editVenueButtons);
    }

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
        rooms.map(room => { 
            const roomDetail = quickDOM('div', room.name);
            const editButton = quickDOM('button','Edit','btn');
            editButton.id = `room_${room.id}`;
            editButton.onclick = () => showAddRoom(id,room);
            roomDetail.append(editButton);
            roomDiv.append(roomDetail);
        });
    } else {
        roomDiv.append(quickDOM('h3', 'You do not have any rooms configured for this Venue'));
    }
    const addRoomButton = quickDOM('button', 'Add Room', 'venue_detail_add_btn','add_room');
    addRoomButton.id = 'add_room';
    roomDiv.append(addRoomButton);
    roomDiv.querySelector('#add_room').onclick = () => showAddRoom(id);
    
    container.append(venue);
    container.append(roomDiv);

    return container;
}

