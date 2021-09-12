/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import Booking from "./Booking";

afterEach(cleanup);

const mockBooking = {
    venue: {
        name: "Test Venue",
        url: "test",
    },
    room: {
        name: "Test Room",
    },
    slots: 7,
    date: "1/1/1970",
};

test("Can the Booking component render", () => {
    render(<Booking booking={mockBooking} />);
});

test("Can I click on the venue name", () => {
    delete window.location;
    window.location = {
        href: "",
    };
    render(<Booking booking={mockBooking} />);
    const venueNameSelector = screen.getByText("Test Venue");
    fireEvent.click(venueNameSelector);
});

test("Booking renders all slots", () => {
    render(<Booking booking={{...mockBooking, slots:4}} />);
    const morningText = screen.getByText("Morning.");
    expect(morningText).not.toBeNull;
    render(<Booking booking={{...mockBooking, slots:2}} />);
    
    const afternoonText = screen.getByText("Afternoon.");
    expect(afternoonText).not.toBeNull;
    render(<Booking booking={{...mockBooking, slots:1}} />);
    const eveningText = screen.getByText("Evening.");
    expect(eveningText).not.toBeNull;

});
