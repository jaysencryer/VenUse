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
    profileMenu.style.display =
        profileMenu.style.display === "block" ? "none" : "block";
};

const showAddVenue = () => {
    console.log("Add Venue clicked");
    const addVenueForm = document.querySelector('#add_venue_form');
    addVenueForm.style.display = "block";
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
    let venueHtml = '';
    try {
        const response = await fetch(`/get_venue/${id}`);
        data = await response.json();
        if (response.ok) {
            const {name, description, url} = data[0];
            venueHtml = `Venue ${id} ${name} ${description} ${url}`;
        } else {
            venueHtml = 'Problem with response';
        }
        
    } catch (err) {
        console.log(err);
        venueHtml = err;
    } finally {
        venue = document.createElement('div');
        venue.innerHTML=venueHtml
        return venue;
    }
}