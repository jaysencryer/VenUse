import { fetchApi, quickDOM } from "./utils.js";

const addressForm = [
    { name: "street1", type: "input-text", label: "Address line 1" },
    { name: "street2", type: "input-text", label: "Address line 2"},
    { name: "city", type: "input-text", label: "City" },
    { name: "country", type: "input-text", label: "Country" },
    { name: "zip", type: "input-text", label: "Zip Code" },
];

export const showAddAddress = (venId, parentElement) => {
    // console.log('adding address');
    let addressFormElement = quickDOM('form', "", "ven-form");
    addressFormElement.id = 'address-form';
    addressForm.forEach( field => {
        const fieldLabel = quickDOM('label', field.label, "ven-form");
        fieldLabel.setAttribute('for',field.name);
        addressFormElement.append(fieldLabel);
        const inputField = quickDOM(field.type, "", "ven-input");
        inputField.id = field.name;
        addressFormElement.append(inputField);
    });
    const submitAddress = quickDOM('button', "Save Address", "ven-btn");
    submitAddress.id = `save_address-${venId}`;
    submitAddress.onclick = () => { saveAddress(venId); return false; }
    addressFormElement.append(submitAddress);
    parentElement.append(addressFormElement);
};

const saveAddress = async (venId) => {
    // TODO update address endpoint needs to be written
    // const completeAddressForm = document.querySelector('#address-form');
    let formBody = {};
    addressForm.forEach( field => {
        formBody[field.name] = document.getElementById(field.name).value;
    })
    const data = await fetchApi(`/post_address/${venId}`, {
        method: 'POST',
        body: JSON.stringify(formBody),
    });
    return false;  
} 
