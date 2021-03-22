document.addEventListener("DOMContentLoaded", () => {
    // When page loads - check for user_id button
    const userHub = document.querySelector("#user_name");
    userHub && (userHub.onclick = () => toggleProfileMenu());
});

const toggleProfileMenu = () => {
    const profileMenu = document.querySelector("#profile_menu");
    profileMenu.style.display =
        profileMenu.style.display === "block" ? "none" : "block";
};
