# This file will help dynamically create the javascript tags to import the react components
# this should only be used for development.  If this project is ever put into production, the React app should
# probably be built separately and packaged up with webpack or similar.
# if a component imports another component it must appear after it in the list

react_components = (
    "MonthSelect",
    "AvailDay",
    "AvailabilityCalendar",
    "Modal",
    "Room",
    "ShowRooms",
    "VenueTitle",
    "Venue")