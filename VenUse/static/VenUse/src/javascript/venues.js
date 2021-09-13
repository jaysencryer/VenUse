import { quickDOM, fetchApi, hideElement, showElement, clearForm } from "./utils.js";
import { makeAvailForm, getAvailability } from "./availability.js";
import { showAddAddress, displayAddress } from "./address.js";
import { showVenueBookings } from "./bookings.js";

document.addEventListener("DOMContentLoaded", () => {
    // When page loads - check for user_id button, and set up profile menu
    const userHub = document.querySelector("#user_name");
    userHub && (userHub.onclick = () => toggleProfileMenu());

    // on manage venue page allow new venue form to be opened dynamically
    const addVenueButton = document.querySelector("#add_venue");
    addVenueButton && (addVenueButton.onclick = () => showAddVenue());

    // Assign an onclick handler to each venue pod in manage view
    const manageContainer = document.querySelector("#manage_container");
    if (manageContainer) {
        const editVenueButtons = manageContainer.querySelectorAll(".venue_pod");
        editVenueButtons &&
            editVenueButtons.forEach(
                editVen => (editVen.onclick = () => showVenueDetail(editVen.id))
            );
    }
});

// // toggleButtons will set enabled buttons in buttonArray to disabled, and disabled buttons to enabled
// const toggleButtons = (buttonArray) => {
//     buttonArray.forEach(btn => btn.disabled = !btn.disabled);
// }

const toggleProfileMenu = () => {
    const profileMenu = document.querySelector("#profile_menu");
    profileMenu.classList.toggle("show_menu");
    profileMenu.querySelector("ul").style.display =
        profileMenu.querySelector("ul").style.display === "block"
            ? "none"
            : "block";
};

const showAddVenue = () => {
    const addVenueDiv = document.querySelector("#add_venue_form");
    const manageContainer = document.querySelector("#manage_container");
    const addVenueForm = addVenueDiv.querySelector("#venue_form");
    const closeVenueFormButton = addVenueForm.querySelector("#close-ven-edit");

    showElement(addVenueDiv);
    hideElement(manageContainer);

    addVenueForm.querySelector("#id_name").focus();
    
    addVenueForm.onsubmit = () => {
        addVenue(addVenueForm);
        showElement(manageContainer);
        hideElement(addVenueDiv);
        return false;
    };

    closeVenueFormButton.onclick = () => {
        hideElement(addVenueDiv);
        showElement(manageContainer);
        return false;
    };
};

const showAddRoom = (venId, roomObject = null) => {
    const addRoomDiv = document.querySelector("#add_room_form");
    const venueDetail = document.querySelector("#venue_detail");
    showElement(addRoomDiv);
    hideElement(venueDetail);

    const availForm = addRoomDiv.querySelector("#avail_form");
    availForm.innerHTML = ""; // Clear any lingering availabilities
    availForm.append(
        makeAvailForm(roomObject ? roomObject.availability : undefined)
    );
    const addRoomForm = addRoomDiv.querySelector("#room_form");

    if (roomObject) {
        // We are editing an existing room
        document.querySelector("#room_form_header").textContent = "Edit Room";
        addRoomForm.querySelector("#add_room_submit").value = "Update";
        addRoomForm.querySelector("#id_name").value = roomObject.name;
        addRoomForm.querySelector("#id_description").value = roomObject.description;
        addRoomForm.querySelector("#id_capacity").value = roomObject.capacity;
    } else {
        document.querySelector("#room_form_header").textContent = "New Room";
        addRoomForm.querySelector("#add_room_submit").value = "Add Room";
        clearForm(addRoomForm);
        // addRoomForm.querySelector("#id_name").value = "";
        // addRoomForm.querySelector("#id_description").value = "";
        // addRoomForm.querySelector("#id_capacity").value = "";
    }

    addRoomForm.querySelector("#id_name").focus();
   
    addRoomForm.onsubmit = () => {
        // Form completed - add the room to the database
        // or if there's a room object update it
        addRoom(addRoomForm, venId, roomObject ? roomObject.id : undefined);
        showElement(venueDetail);
        hideElement(addRoomDiv);
        return false;
    };
  
    const closeButton = addRoomForm.querySelector("#add_room_close");
 
    closeButton.onclick = () => {
        showElement(venueDetail);
        hideElement(addRoomDiv);
        roomObject = null;
        return false;
    };
};

const addRoom = async (roomForm, venId, roomId = null) => {
    let roomName = roomForm.querySelector("#id_name").value;
    let roomDescription = roomForm.querySelector("#id_description").value;
    let roomCapacity = roomForm.querySelector("#id_capacity").value;
    let roomAvailability = await getAvailability(
        roomForm.querySelector("#avail_form")
    );

    const apiMethod = roomId ? "PUT" : "POST"; // If we have a room Id already we are updating the info
    const data = await fetchApi("/add_room", {
        method: apiMethod,
        body: JSON.stringify({
            room_id: roomId,
            venue_id: venId,
            name: roomName,
            description: roomDescription,
            capacity: roomCapacity,
            availability: roomAvailability,
        }),
    });
    // clear the form once we're happy update has happened.
    if (!("error" in data)) {
        clearForm(roomForm);
        roomForm.querySelector("#avail_form").innerHTML = "";
        // Hide the form
        document.querySelector("#add_room_form").style.display = "none";
        // update the edit view
        showVenueDetail(venId);
    }

    return false;
};

const addVenue = async venueForm => {
    let venueName = venueForm.querySelector("#id_name").value;
    let venueUrl = venueForm.querySelector("#id_url").value;
    let venueDescription = venueForm.querySelector("#id_description").value;
    const data = await fetchApi("/add_venue", {
        method: "POST",
        body: JSON.stringify({
            name: venueName,
            url: venueUrl,
            description: venueDescription,
        }),
    });

    clearForm(venueForm);
    // update the main view

    return false;
};

const showVenueDetail = async id => {
    const venueDetail = document.querySelector("#venue_detail");
    const manageView = document.querySelector("#manage_container");
    venueDetail.innerHTML = "";

    showElement(venueDetail);
    hideElement(manageView);

    const venElement = await venueDisplay(id);
    venueDetail.append(venElement);
    
    const viewVenueBookings = venueDetail.querySelector("#ven_view_bookings");
    viewVenueBookings.onclick = () => {
        showVenueBookings(id);
        // document.querySelector('#venue-booking-close'.o);

        hideElement(venueDetail);
    }

    const closeButton = venueDetail.querySelector("#ven_close");
    closeButton.onclick = () => {
        showElement(manageView);
        hideElement(venueDetail);
    };
};

const venueDisplay = async id => {
    // fetch the venue(id) data from API, including rooms
    const data = await fetchApi(`/get_venue/${id}`);
    // console.log(data);
    if (data.error) {
        return quickDOM("h3", data.error, 'error-alert');
    }

    const venueData = data[0];
    const rooms = data[1];
    const address = data[3];
    const container = quickDOM("div", "", "venue_detail_container");
    const venue = quickDOM("div", "", "venue_detail_main");
    venue.append(quickDOM("h1", venueData.name));
    const venueLink = quickDOM("a", venueData.url, "venue-link");
    venueLink.href = `/Venue/${venueData.url}`;
    venue.append(venueLink);
    venue.append(quickDOM("small", venueData.description));

    if ("street1" in address) {
        venue.append(displayAddress(address));
    } else {
        const noAddressMessage = quickDOM("p", "You have not added an address for this venue yet!", "venue_detail_add");
        noAddressMessage.id = "no-address";
        venue.append(noAddressMessage);
        const addAddressButton = quickDOM(
            "button",
            "Add Address",
            "ven-btn",
            "add_address"
        );

        addAddressButton.onclick = () => {
            addAddressButton.disabled = true;
            hideElement(addAddressButton);
            hideElement(noAddressMessage);
            showAddAddress(id, venue);
        };

        venue.append(addAddressButton);
    }

    const viewBookingsButton = quickDOM("button", "View Venue Bookings", "ven-btn");
    viewBookingsButton.id = "ven_view_bookings";
    venue.append(viewBookingsButton);

    const closeButton = quickDOM("button", "Close", "ven-btn");
    closeButton.id = "ven_close";
    venue.append(closeButton);

    const roomDiv = quickDOM("div", "", "venue_room_detail");
    roomDiv.append(quickDOM("h3", "Rooms"));
    const addRoomButton = quickDOM(
        "button",
        "Add Room",
        "ven-btn-sm",
        "add_room"
    );
    addRoomButton.id = "add_room";
    addRoomButton.classList.add("btn-standout");
    roomDiv.append(addRoomButton);
    roomDiv.querySelector("#add_room").onclick = () => showAddRoom(id);
    if (rooms.length > 0) {
        // We have rooms configured
        rooms.map(room => {
            const roomDetail = quickDOM("button", room.name, "room-list");
            roomDetail.id = `room_${room.id}`;
            roomDetail.onclick = () => showAddRoom(id, room);
            roomDiv.append(roomDetail);
        });
    } else {
        roomDiv.append(quickDOM("h3","You do not have any rooms configured for this Venue"));
    }

    container.append(venue);
    container.append(roomDiv);

    return container;
};
