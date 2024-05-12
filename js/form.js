import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { app } from '../config/db.js';
import { userID } from '../globals/globals.js';


const firestore = getFirestore(app);
const timestamp = serverTimestamp();

document.addEventListener("DOMContentLoaded", function () {
    const saveChangesBtn = document.getElementById('saveChangesBtn');

    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', saveChanges);
    }
});

const input = document.querySelector("#inputPhoneNumber");
let phoneNumber;

// Initialize intlTelInput
const iti = window.intlTelInput(input, {
    initialCountry: "qa",
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@22.0.2/build/js/utils.js",
});

// Listen for input event on phone number input field
input.addEventListener('input', function () {
    // Get the country code
    const countryCode = iti.getSelectedCountryData().dialCode;
    // Get the raw input value (without formatting)
    const rawPhoneNumber = input.value;
    // Concatenate country code with raw phone number
    const phoneNumberWithCountryCode = '+' + countryCode + ' ' + rawPhoneNumber;
    // Log the phone number with country code to the console
    // console.log("Phone Number:", phoneNumberWithCountryCode);

    phoneNumber = phoneNumberWithCountryCode
});


function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
}

function formatDate(date) {
    let month = date.getMonth() + 1; // Month is zero based
    let day = date.getDate();
    let year = date.getFullYear();
    return month + '/' + day + '/' + year;
}

function timeStamp() {
    let date = new Date();
    let formattedDate = formatDate(date);
    let formattedTime = formatAMPM(date);
    return { date: formattedDate, time: formattedTime };
}

async function saveChanges() {
    const { date, time } = timeStamp();
    const uid = userID;

    const firstName = document.getElementById('inputFirstName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const place = document.getElementById('inputPlace').value.trim();
    const birthday = document.getElementById('birthday').value.trim();
    const nationality = document.getElementById('inputNationality').value.trim();

    if (!uid) {
        // console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Validate inputs
    if (validateInputs(firstName, email, place, birthday, nationality)) {
        const dataToSave = {
            firstName: firstName,
            phoneNumber: phoneNumber,
            email: email,
            place: place,
            birthday: birthday,
            nationality: nationality,
            date: date,
            time: time,
            timestamp: timestamp
        };

        const userDocRef = collection(firestore, `users/${uid}/table`);

        try {
            const docRef = await addDoc(userDocRef, dataToSave);
            localStorage.setItem('num', phoneNumber);
            // console.log('Data successfully added to Firestore');
            window.location.href = '../pages/scratchCard.html';
        } catch (error) {
            // console.error('Error adding data to Firestore: ', error);
            // Show error message to user
            showError('Error adding data to Firestore. Please try again later.');
        }
    }
}

function validateInputs(firstName, email, place, birthday, nationality) {
    if (!firstName || !email || !place || !birthday || !nationality) {
        showError('Please fill in all required fields.');
        return false;
    }

    // Validate phone number
    // const phoneRegex = /^\d{10}$/;
    // if (!phoneRegex.test(phoneNumber)) {
    //     showError('Please enter a valid phone number.');
    //     return false;
    // }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        return false;
    }

    return true;
}

function showError(message) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
    setTimeout(() => {
        errorMessageElement.style.display = 'none';
    }, 5000);
}
