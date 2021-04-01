document.addEventListener("DOMContentLoaded", () => {
    // When page loads - check for user_id button
    const userHub = document.querySelector("#user_name");
    const addVenueButton = document.querySelector("#add_venue");

    userHub && (userHub.onclick = () => toggleProfileMenu());
    addVenueButton && (addVenueButton.onclick = () => showAddVenue());

});

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