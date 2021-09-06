import { fetchApi, hideElement, quickDOM, showBookedSlots, showElement } from "./utils.js";

export const showVenueBookings = async (venueId) => {
    const manageContainer = document.querySelector('#manage_container');
    const venueBookingsContainer = document.querySelector('#venue_bookings');
    const venueBookingsDiv = quickDOM('table','','ven-bookings');
    
    const venueBookings = await fetchApi(`/get_bookings/venue/${venueId}`);
    if (venueBookings.error) {
        venueBookingsDiv.append(quickDOM("h3", venueBookings.error, 'error-alert'));
    }

    const bookingsHeader = ['Room', 'Date', 'User', 'Slots'];
    const headerRow = quickDOM("tr",'','booking-table');
    bookingsHeader.map( (heading, index) => {
        headerRow.append(quickDOM("th",heading,`${index === 0 || index === 3 ? 'booking-head-ends' : 'booking-head'}`));
    })
    venueBookingsDiv.append(headerRow);

    venueBookings.map( booking => {
        const bookingsContainer = quickDOM("tr",'','booking-table');
        bookingsContainer.append(quickDOM("td",booking.room));
        bookingsContainer.append(quickDOM("td",booking.booking.date));
        bookingsContainer.append(quickDOM("td",booking.booking.user));
        bookingsContainer.append(quickDOM("td",showBookedSlots(booking.booking.slot)));
        venueBookingsDiv.append(bookingsContainer);
    });


    venueBookingsContainer.append(venueBookingsDiv);

    const venueBookingCloseButton = quickDOM('button','Close','ven-btn','close-ven-booking');
    venueBookingCloseButton.onclick = () => {
        showElement(manageContainer);
        venueBookingsContainer.innerHTML = '';
        hideElement(venueBookingsContainer);
    }

    venueBookingsContainer.append(venueBookingCloseButton);

    showElement(venueBookingsContainer);
};