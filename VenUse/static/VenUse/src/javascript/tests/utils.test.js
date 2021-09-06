/**
 * @jest-environment jsdom
 */
import "regenerator-runtime/runtime";

import fetchMock from "jest-fetch-mock";

import {
    showBookedSlots,
    quickDOM,
    fetchApi,
    hideElement,
    showElement,
    clearForm,
} from "../utils";
import { beforeEach, expect, test } from "@jest/globals";

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

test("test that fetchAPi returns data correctly", async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: "return data" }), {
        status: 200,
    });
    const testResponse = await fetchApi("anything");
    expect(testResponse.data).toBe("return data");
});

test("when fetchApi fails it returns the error object", async () => {
    fetch.mockResponseOnce(
        JSON.stringify({ error: "test error response" }), { status: 400}
    );
    const testResponse = await fetchApi("/test");
    expect(testResponse.error).toBe("test error response");
});

test("when fetchApi fails with no error reponse set it returns status:statusText", async () => {
    fetch.mockResponseOnce(
        JSON.stringify({}),{ status: 400}
    );
    const testResponse = await fetchApi("/test");
    expect(testResponse.error).toBe("400:Bad Request");

});

test("when fetchApi throws an exception (illegal url) it returns the error", async () => {
    fetch.mockImplementation(
        () => { throw "test Exception"; } 
        );
        const testResponse = await fetchApi("/test");
        expect(testResponse.error).toBe("test Exception");
        

});

test("quickDOM returns a valid html element", () => {
    const testElement = quickDOM("div", "", "");
    expect(testElement).toBeInstanceOf(HTMLDivElement);
});

test("quickDOM sets inner text, class and value correctly", () => {
    const testElement = quickDOM(
        "span",
        "Test Span",
        "test-class",
        "test-value"
    );
    expect(testElement).toBeInstanceOf(HTMLSpanElement);
    expect(testElement.innerText).toContain("Test Span");
    expect(testElement.classList).toContain("test-class");
    expect(testElement.value).toContain("test-value");
});

test("quickDOM can create an input", () => {
    const testTextInput = quickDOM("input-text", "Test Input", "");
    expect(testTextInput).toBeInstanceOf(HTMLInputElement);
    const testCheckBox = quickDOM("input-checkbox");
    expect(testCheckBox).toBeInstanceOf(HTMLInputElement);
    expect(testCheckBox.checked).toBeDefined();
});

test("hideElement changes display to none", () => {
    const testElement = quickDOM("div");
    testElement.style.display = "block";
    hideElement(testElement);
    expect(testElement.style.display).toBe("none");
});

test("showElement changes display to block", () => {
    const scrollTo = jest
        .spyOn(window, "scrollTo")
        .mockImplementation(() => {});
    const testElement = quickDOM("div");
    testElement.style.display = "none";
    showElement(testElement);
    expect(testElement.style.display).toBe("block");
    expect(scrollTo).toHaveBeenCalled();
});

test("clearForm clears all inputs in a form", () => {
    const formInputs = [
        quickDOM("input-text", "", "", "test"),
        quickDOM("textarea", "", "", "test text area"),
        quickDOM("input-checkbox", "", ""),
        quickDOM("input-number", "", "", "6"),
    ];
    const form = quickDOM("form");
    let formValues = formInputs.map(input => {
        form.append(input);
        return input.value;
    });
    expect(formValues).toContain("test");
    expect(formValues).toContain("test text area");
    expect(formValues).toContain("6");
    const checkBox = form.querySelector("input[type='checkbox']");
    checkBox.checked = true;
    expect(checkBox.checked).toBe(true);
    clearForm(form);
    formValues = formInputs.map(input => {
        return input.value;
    });
    expect(formValues).not.toContain("test");
    expect(formValues).not.toContain("test text area");
    expect(formValues).not.toContain("6");
    const emptyFormValues = ["", "", "", ""];
    expect(formValues).toEqual(emptyFormValues);
    expect(checkBox.checked).toBe(false);
});

test("showBookedSlots shows correct text", () => {
    const slot = 7;
    let textResponse = showBookedSlots(7);
    expect(textResponse).toBe("Morning, Afternoon, Evening.");
    textResponse = showBookedSlots(6);
    expect(textResponse).toBe("Morning, Afternoon.");
    textResponse = showBookedSlots(5);
    expect(textResponse).toBe("Morning, Evening.");
    textResponse = showBookedSlots(4);
    expect(textResponse).toBe("Morning.");
    textResponse = showBookedSlots(3);
    expect(textResponse).toBe("Afternoon, Evening.");
    textResponse = showBookedSlots(2);
    expect(textResponse).toBe("Afternoon.");
    textResponse = showBookedSlots(1);
    expect(textResponse).toBe("Evening.");
});
