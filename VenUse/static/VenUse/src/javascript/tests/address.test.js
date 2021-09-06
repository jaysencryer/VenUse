/**
 * @jest-environment jsdom
 */
import "regenerator-runtime/runtime";
import fetchMock from "jest-fetch-mock";

import { showAddAddress, saveAddress, displayAddress } from "../address";

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

const mockTestAddress = {
    address: {
        street1: "test address",
        street2: "",
        city: "cityville",
        state: "stateland",
        country: "USA",
        zip: "12345",
    },
};

test("showAddAddress creates an address form and appends it", () => {
    const container = document.createElement("div");
    showAddAddress(1, container);
    const addressForm = container.querySelector("form");
    expect(addressForm.id).toBe("address-form");
});

test("showAddAddress form has a submit button that can be clicked", async () => {
    fetch.mockResponseOnce(JSON.stringify(mockTestAddress), {
        status: 200,
    });
    const container = document.createElement("div");
    document.body.append(container);
    container.append(document.createElement("div"));
    showAddAddress(1, container);
    const submitButton = container.querySelector("button");
    expect(submitButton.id).toBe("save_address-1");
    container.querySelector('#street1').value = "test street";
    submitButton.click();
    expect(fetch).toHaveBeenCalled();
});

test("showAddAddress can handle an error", async () => {
    fetch.mockResponseOnce(JSON.stringify({error: 'An error'}), {
        status: 400,
    });
    const container = document.createElement("div");
    document.body.append(container);
    container.append(document.createElement("div"));
    showAddAddress(1, container);
    const submitButton = container.querySelector("button");
    expect(submitButton.id).toBe("save_address-1");
    submitButton.click();
    expect(fetch).toHaveBeenCalled();
});

test("displayAddress shows an address", ()=> {
    const addressDisplayed = displayAddress(mockTestAddress.address);
    const allTheSpans = addressDisplayed.querySelectorAll('span');
    expect(allTheSpans.length).toBe(6);
    expect(allTheSpans[0].innerText).toBe('test address');
    expect(allTheSpans[5].innerText).toBe('12345');
});