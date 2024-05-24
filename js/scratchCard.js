// import {
//     getFirestore,
//     collection,
//     addDoc,
//     doc,
//     getDocs,
//     setDoc,
//     serverTimestamp,
//     query,
//     orderBy,
//     updateDoc,
//     where
// } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
// import { app } from '../config/db.js';
// import { userID } from '../globals/globals.js';

// const firestore = getFirestore(app);
// const timestamp = serverTimestamp()

// let winnerID, dateTime, prize;


// // Function to retrieve data from Firebase and initialize scratch card
// async function retrieveDataAndInitializeScratchCard() {
//     const uid = userID;

//     if (!uid) {
//         // console.error('User not authenticated');
//         return;
//     }

//     const userDocRef = collection(firestore, `users/${uid}/prizeList`);

//     try {
//         const querySnapshot = await getDocs(query(userDocRef, orderBy('timestamp', 'asc')));
//         const cardsData = [];

//         querySnapshot.forEach((doc) => {
//             const data = doc.data();
//             data.id = doc.id;
//             cardsData.push(data);
//         });

//         // Sort cardsData array based on count in descending order
//         cardsData.sort((a, b) => b.count - a.count);

//         // Check if there are available cards
//         if (cardsData.length > 0) {
//             const card = cardsData[0]; // Select the first card (highest count)

//             // Check if counts are available
//             if (card.count > 0) {
//                 initializeScratchCard(card);
//             } else {
//                 // If counts are not available, handle it accordingly (e.g., show a message).
//                 // console.log("No counts available for this card.");
//             }
//         } else {
//             // console.log("No scratch cards available for this user.");
//         }
//     } catch (error) {
//         // console.error('Error retrieving data from Firebase:', error);
//     }
// }


// // Function to initialize scratch card with data
// function initializeScratchCard(cardData) {
//     // Define a variable to store a reference to the timeout
//     let scratchMoveTimeout;

//     $("#card").wScratchPad({
//         size: 100,
//         bg: cardData.photoUrl,
//         fg: "../Images/8802794.png",
//         cursor: "pointer",
//         scratchMove: function (e, percent) {
//             // Clear the previous timeout
//             clearTimeout(scratchMoveTimeout);

//             // Set a new timeout to call updateCount after a delay of 500 milliseconds
//             scratchMoveTimeout = setTimeout(() => {
//                 // If scratch reaches a certain threshold (e.g., 50%), update count in database
//                 if (percent > 50) {
//                     updateCount(cardData);
//                 }
//             }, 1000); // Adjust the delay as needed
//         }
//     });
// }

// function updateCount(cardData) {
//     const uid = userID;

//     // Reference to the "prizeList" collection
//     const cardRef = collection(firestore, `users/${uid}/prizeList`);

//     // Use where clause to target the specific document based on its ID
//     const querys = query(cardRef, where('prizeID', '==', cardData.prizeID));

//     getDocs(querys)
//         .then(async (querySnapshot) => {
//             querySnapshot.forEach(async (doc) => {
//                 // console.log(doc.id);
//                 await updateDoc(doc.ref, {
//                     count: cardData.count - 1 // Decrease count by 1
//                 }).then(async () => {
//                     // console.log("Count updated successfully.");

//                     // Get the phone number from localStorage
//                     var number = localStorage.getItem('num');

//                     if (!number) {
//                         window.location.href = './form.html'
//                     }

//                     const winID = await generateUniqueRandomId();

//                     // Reference to the "table" collection
//                     const tableRef = collection(firestore, `users/${uid}/table`);

//                     // Query to find the document where phoneNumber matches
//                     const tableQuery = query(tableRef, where('phoneNumber', '==', number));

//                     // Fetch the matching document
//                     const tableQuerySnapshot = await getDocs(tableQuery);

//                     // Update the field inside the document
//                     tableQuerySnapshot.forEach(async (tableDoc) => {
//                         await updateDoc(tableDoc.ref, {
//                             // Add a new field to the document
//                             winID: winID,
//                             prizeName: cardData.prizeName // newValue is the value you want to assign to the new field
//                         }).then(() => {
//                             // console.log("New field added successfully to the table document.");
//                             document.getElementById('successMessage').style.display = 'block'
//                             document.getElementById('winID').textContent = winID;

//                             const now = new Date();

//                             const dateString = now.toLocaleDateString(); // Get date string in locale-specific format
//                             const hours = formatTimePart(now.getHours());
//                             const minutes = formatTimePart(now.getMinutes());
//                             const seconds = formatTimePart(now.getSeconds());
//                             const timeString = hours + ':' + minutes + ':' + seconds;

//                             winnerID = winID;
//                             prize = cardData.prizeName;
//                             dateTime = dateString + '  ' + timeString;

//                             document.getElementById('downloadImageBtn').style.display = 'block';
//                         }).catch((error) => {
//                             // console.error("Error adding new field to the table document: ", error);
//                         });
//                     });
//                 }).catch((error) => {
//                     // console.error("Error updating count: ", error);
//                 });
//             });
//         })
//         .catch((error) => {
//             // console.error("Error updating count: ", error);
//         });
// }



// // Call the function to retrieve data from Firebase and initialize scratch card
// retrieveDataAndInitializeScratchCard();

// async function generateUniqueRandomId() {
//     const uid = userID;
//     let isUnique = false;
//     let winID;

//     // Reference to the "table" collection
//     const tableRef = collection(firestore, `users/${uid}/table`);

//     while (!isUnique) {
//         // Generate a random 5-digit number
//         const randomNumber = Math.floor(10000 + Math.random() * 90000);
//         winID = randomNumber.toString();

//         // Check if the generated ID already exists in the collection
//         const querySnapshot = await getDocs(query(tableRef, where('winID', '==', winID)));

//         if (querySnapshot.empty) {
//             isUnique = true;
//         }
//     }

//     return winID;
// }


// function formatTimePart(part) {
//     return part < 10 ? '0' + part : part;
// }

// // Function to handle automatic download
// function autoDownload() {
//     // Create a canvas element to draw the image, logo, and text
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');

//     // Set canvas dimensions based on your image size
//     canvas.width = 2000; // Adjust as per your image dimensions
//     canvas.height = 2000; // Adjust as per your image dimensions

//     // Load your main image
//     const img = new Image();
//     img.src = '../congratulations.jpg'; // Replace with your image path

//     img.onload = function () {
//         // Draw your main image on canvas
//         ctx.drawImage(img, 0, 0);

//         // Add text
//         ctx.font = '100px Arial';
//         ctx.fillStyle = 'black';
//         ctx.fillText(prize, 800, 1550); // Adjust position as needed
//         ctx.fillText('Winner ID: ' + winnerID, 650, 1700);
//         ctx.fillText(dateTime, 600, 1850);

//         // Append canvas to document body (temporary for dataURL generation)
//         document.body.appendChild(canvas);

//         // Convert canvas to data URL
//         const dataURL = canvas.toDataURL("image/png");
//         const link = document.createElement('a');
//         link.href = dataURL;
//         link.download = 'prize-details.png'; // Filename

//         link.click();

//         // Remove canvas from document body
//         document.body.removeChild(canvas);

//         // Call resetAndRedirect which will handle redirect now
//         resetAndRedirect();
//     };
// }


// // Initiate download using the new function
// document.getElementById('downloadImageBtn').addEventListener('click', autoDownload);

// function resetAndRedirect() {
//     const num = localStorage.getItem('num');
//     if (num) {
//         localStorage.removeItem('num');

//         // Redirect to index page after a slight delay
//         setTimeout(() => {
//             window.location.href = '../index.html';
//         }, 10000); // Adjust delay if needed
//     }
// }

import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    setDoc,
    serverTimestamp,
    query,
    orderBy,
    updateDoc,
    where
} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { app } from '../config/db.js';
import { userID } from '../globals/globals.js';

const firestore = getFirestore(app);
const timestamp = serverTimestamp()

let winnerID, dateTime, prize;

const cardsData = [];

async function retrieveDataAndInitializeScratchCard() {
    const uid = userID;

    if (!uid) {
        // Handle unauthenticated user
        return;
    }

    try {
        const userDocRef = collection(firestore, `users/${uid}/prizeList`);
        const querySnapshot = await getDocs(query(userDocRef, orderBy('timestamp', 'asc')));

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            cardsData.push(data);
        });

        const selectedPrize = selectRandomAvailablePrize(cardsData);

        if (selectedPrize) {
            initializeScratchCard(selectedPrize);
        }
    } catch (error) {
        console.error('Error retrieving data from Firebase:', error);
        // Handle error (e.g., show error message to user)
    }
}

function selectRandomAvailablePrize(cardsData) {
    const availablePrizes = cardsData.filter(card => card.count > 0);
    if (availablePrizes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePrizes.length);
        return availablePrizes[randomIndex].prizeName;
    }
    return null;
}


// Function to initialize scratch card with data
function initializeScratchCard(data) {
    // console.log(data);
    let purchaseCriteria;
    let prize = data

    if (prize === '1 GRAM COIN') {
        purchaseCriteria = 'Minimum 3000 QAR Purchase';
    } else if (prize === '500 QAR') {
        purchaseCriteria = 'Minimum 5000 QAR Purchase';
    } else if (prize === '100 QAR') {
        purchaseCriteria = 'Minimum 1500 QAR Purchase';
    } else if (prize === '50 QAR') {
        purchaseCriteria = 'Minimum 500 QAR Purchase';
    } else if (prize === '0% MC SELECTED') {
        purchaseCriteria = 'Zero Making Charge on Seleted Items';
    } else if (prize === '0% MC 40 GRAMS') {
        purchaseCriteria = 'Zero Making Charge upto 40 Grams';
    }

    // console.log("New field added successfully to the table document.");
    document.getElementById('condition').textContent = purchaseCriteria;
    // Define a variable to store a reference to the timeout
    let scratchMoveTimeout;

    cardsData.forEach((cardData) => {
        // console.log(cardData.prizeName);
        if (cardData.prizeName === data) {
            $("#card").wScratchPad({
                size: 100,
                bg: cardData.photoUrl,
                fg: "../Images/8802794.png",
                cursor: "pointer",
                scratchMove: function (e, percent) {
                    // Clear the previous timeout
                    clearTimeout(scratchMoveTimeout);

                    // Set a new timeout to call updateCount after a delay of 500 milliseconds
                    scratchMoveTimeout = setTimeout(() => {
                        // If scratch reaches a certain threshold (e.g., 50%), update count in database
                        if (percent > 50) {
                            updateCount(cardData);
                        }
                    }, 1000); // Adjust the delay as needed
                }
            });
        }
    })

}

function updateCount(cardData) {
    const uid = userID;

    // Reference to the "prizeList" collection
    const cardRef = collection(firestore, `users/${uid}/prizeList`);

    // Use where clause to target the specific document based on its ID
    const querys = query(cardRef, where('prizeID', '==', cardData.prizeID));

    getDocs(querys)
        .then(async (querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                // console.log(doc.id);
                await updateDoc(doc.ref, {
                    count: cardData.count - 1 // Decrease count by 1
                }).then(async () => {
                    // console.log("Count updated successfully.");

                    // Get the phone number from localStorage
                    var number = localStorage.getItem('num');

                    if (!number) {
                        window.location.href = './form.html'
                    }

                    const winID = await generateUniqueRandomId();
                    // console.log(winID);

                    // Reference to the "table" collection
                    const tableRef = collection(firestore, `users/${uid}/table`);

                    // Query to find the document where phoneNumber matches
                    const tableQuery = query(tableRef, where('phoneNumber', '==', number));

                    // Fetch the matching document
                    const tableQuerySnapshot = await getDocs(tableQuery);

                    // Update the field inside the document
                    tableQuerySnapshot.forEach(async (tableDoc) => {
                        await updateDoc(tableDoc.ref, {
                            // Add a new field to the document
                            winID: winID,
                            prizeName: cardData.prizeName // newValue is the value you want to assign to the new field
                        }).then(() => {
                            document.getElementById('successMessage').style.display = 'block'
                            document.getElementById('winID').textContent = winID;

                            const now = new Date();

                            const dateString = now.toLocaleDateString(); // Get date string in locale-specific format
                            const hours = formatTimePart(now.getHours());
                            const minutes = formatTimePart(now.getMinutes());
                            const seconds = formatTimePart(now.getSeconds());
                            const timeString = hours + ':' + minutes + ':' + seconds;

                            winnerID = winID;
                            prize = cardData.prizeName;
                            dateTime = dateString + '  ' + timeString;

                            document.getElementById('downloadImageBtn').style.display = 'block';
                        }).catch((error) => {
                            // console.error("Error adding new field to the table document: ", error);
                        });
                    });
                }).catch((error) => {
                    console.error("Error updating count: ", error);
                });
            });
        })
        .catch((error) => {
            // console.error("Error updating count: ", error);
        });
}



// Call the function to retrieve data from Firebase and initialize scratch card
retrieveDataAndInitializeScratchCard();

async function generateUniqueRandomId() {
    const uid = userID;
    let isUnique = false;
    let winID;

    // Reference to the "table" collection
    const tableRef = collection(firestore, `users/${uid}/table`);

    while (!isUnique) {
        // Generate a random 5-digit number
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        winID = randomNumber.toString();

        // Check if the generated ID already exists in the collection
        const querySnapshot = await getDocs(query(tableRef, where('winID', '==', winID)));

        if (querySnapshot.empty) {
            isUnique = true;
        }
    }

    return winID;
}


function formatTimePart(part) {
    return part < 10 ? '0' + part : part;
}

// Function to handle automatic download
function autoDownload() {
    // Create a canvas element to draw the image, logo, and text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions based on your image size
    canvas.width = 2000; // Adjust as per your image dimensions
    canvas.height = 2000; // Adjust as per your image dimensions

    // Load your main image
    const img = new Image();
    img.src = '../congratulations-naira-.jpg'; // Replace with your image path

    img.onload = function () {
        // Draw your main image on canvas
        ctx.drawImage(img, 0, 0);

        // Add text
        ctx.font = '70px Arial';
        ctx.fillStyle = 'grey';

        let purchaseCriteria;

        if (prize === '1 GRAM COIN') {
            purchaseCriteria = 'Minimum 3000 QAR Purchase';
        } else if (prize === '500 QAR') {
            purchaseCriteria = 'Minimum 5000 QAR Purchase';
        } else if (prize === '100 QAR') {
            purchaseCriteria = 'Minimum 1500 QAR Purchase';
        } else if (prize === '50 QAR') {
            purchaseCriteria = 'Minimum 500 QAR Purchase';
        } else if (prize === '0% MC SELECTED') {
            purchaseCriteria = 'Zero Making Charge on Seleted Items';
        } else if (prize === '0% MC 40 GRAMS') {
            purchaseCriteria = 'Zero Making Charge upto 40 Grams';
        }

        // Calculate text width for center alignment
        const prizeTextWidth = ctx.measureText(prize).width;
        const purchaseCriteriaTextWidth = ctx.measureText(purchaseCriteria).width;
        const winnerIDTextWidth = ctx.measureText('Winner ID: ' + winnerID).width;
        const dateTimeTextWidth = ctx.measureText(dateTime).width;

        // Center align text horizontally
        const prizeX = (canvas.width - prizeTextWidth) / 2;
        const purchaseCriteriaX = (canvas.width - purchaseCriteriaTextWidth) / 2;
        const winnerIDX = (canvas.width - winnerIDTextWidth) / 2;
        const dateTimeX = (canvas.width - dateTimeTextWidth) / 2;

        ctx.fillText(prize, prizeX, 1300); // Adjust position as needed
        ctx.fillText(purchaseCriteria, purchaseCriteriaX, 1400);
        ctx.fillText('Winner ID: ' + winnerID, winnerIDX, 1500);
        ctx.fillText(dateTime, dateTimeX, 1650);

        // Append canvas to document body (temporary for dataURL generation)
        document.body.appendChild(canvas);

        // Convert canvas to data URL
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'prize-details.png'; // Filename

        link.click();

        // Remove canvas from document body
        document.body.removeChild(canvas);

        // Call resetAndRedirect which will handle redirect now
        resetAndRedirect();
    };
}



// Initiate download using the new function
document.getElementById('downloadImageBtn').addEventListener('click', autoDownload);

function resetAndRedirect() {
    const num = localStorage.getItem('num');
    if (num) {
        localStorage.removeItem('num');

        // Redirect to index page after a slight delay
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 10000); // Adjust delay if needed
    }
}