import { showBookedSlots } from "../utils.js";


test("showBookedSlots shows correct text", () => {
    const slot = 7;
    const textResponse = showBookedSlots(7);
    console.log(textResponse);
});