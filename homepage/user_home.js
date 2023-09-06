


const firebaseConfig = {
  apiKey: "AIzaSyCDy_20_bUcavMKnPEHtTRj-GOG9tt3uak",
  authDomain: "test-aceff.firebaseapp.com",
  databaseURL: "https://test-aceff-default-rtdb.firebaseio.com",
  projectId: "test-aceff",
  storageBucket: "test-aceff.appspot.com",
  messagingSenderId: "683964301994",
  appId: "1:683964301994:web:12ee632f6708d4569986d3",
  measurementId: "G-G794ERM9YN"
};
firebase.initializeApp(firebaseConfig);

const fileInput = document.getElementById('file-input');
    const profilePicture = document.getElementById('profile-picture');

    // Listen for file input change
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        uploadProfilePicture(file);
      }
    });


 // Get reference to the anchor tag
 var myLink = document.getElementById("setting");

 // Attach a click event handler
 myLink.addEventListener("click", function(event) {
   event.preventDefault(); // Prevent the link from navigating to its href

   // Display an alert message
   alert("Anchor tag clicked!"+ storedUserId);
 });

 // Upload profile picture to Firebase Storage
function uploadProfilePicture(file) {
  const storageRef = firebase.storage().ref();
  const profilePictureRef = storageRef.child(`profile-pictures/${storedUserId}/profilePicture.jpg`);

  const uploadTask = profilePictureRef.put(file);

  uploadTask.on('state_changed',
    (snapshot) => {
      // Track upload progress if needed
    },
    (error) => {
      console.error('Error uploading file:', error);
    },
    () => {
      console.log('File uploaded successfully');
      displayProfilePicture();
    }
  );
}

// Display profile picture from Firebase Storage
function displayProfilePicture() {
  const storageRef = firebase.storage().ref();
  const profilePictureRef = storageRef.child(`profile-pictures/${storedUserId}/profilePicture.jpg`);

  profilePictureRef.getDownloadURL()
    .then((url) => {
      profilePicture.src = url;
    })
    .catch((error) => {
      console.error('Error retrieving profile picture:', error);
    });
}


    


const menuLink = document.getElementById('profile_menu');
const menu = document.querySelector('.menu');

menuLink.addEventListener('click', (event) => {
  event.preventDefault(); // Prevents the link from navigating

  menu.classList.toggle('open');
});

document.addEventListener('click', (event) => {
  const targetElement = event.target;
  if (!menu.contains(targetElement) && targetElement !== menuLink) {
    menu.classList.remove('open');
  }
});


// Declare the variables outside the callback
let storedUserId;
let storedUserData;
let workerUserIds ;

window.addEventListener('DOMContentLoaded', (event) => {

  // ==============Get the user ID and data when the page is loaded============================================

  // Listen for authentication state changes
  firebase.auth().onAuthStateChanged((user) => {
    // User is signed in, retrieve the user ID
    if (user) {
      const userId = user.uid;

      // Retrieve the user data from the Realtime Database
      const userRef = firebase.database().ref('users/' + userId);
      userRef.once('value')
        .then((snapshot) => {
          const userData = snapshot.val();
          // Access the userId and other user data
          console.log('User ID:', userId);
          console.log('User Data:', userData);

          // Store the user ID and data in global variables
          storedUserId = userId;
          storedUserData = userData;
          displayProfilePicture();
          displayUserData(storedUserData);
        })
        .catch((error) => {
          console.error('Error retrieving user data:', error);
        });
    } else {
      // User is signed out, handle accordingly
      console.log('No user is currently signed in.');
    }
  });

  //===========TO DISPLAY WORKERS DATA=========================
  

  const workersRef = firebase.database().ref('workers');
  workersRef.once('value')
    .then((snapshot) => {
      const workersData = snapshot.val();
          // Extract user UIDs from the workersData object
    workerUserIds = Object.keys(workersData);

    // Use the workerUserIds array as needed
    console.log(workerUserIds);
      displayWorkersData(workersData);
    })
    .catch((error) => {
      console.error('Error retrieving workers data:', error);
    });
});

function displayWorkersData(workersData) {
  const workersContainer = document.getElementById('workersContainer');

  Object.entries(workersData).forEach(([workerId, worker]) => {
    const workerBox = document.createElement('div');
    workerBox.classList.add('worker-box');

    // Create an image element
    const workerImage = document.createElement('img');
    workerImage.classList.add('worker-image');
    workerImage.setAttribute('src', ''); // Initially set an empty source
    workerImage.setAttribute('alt', 'Worker Image');
    workerBox.appendChild(workerImage);

    // Create a container for the worker's data
    const workerDataContainer = document.createElement('div');
    workerDataContainer.classList.add('worker-data-container');
    workerBox.appendChild(workerDataContainer);

    const workerList = document.createElement('ul');
    workerList.classList.add('worker-list');

    const propertyOrder = ['full_name', 'email', 'job_title', 'available_time', 'about_you'];

    propertyOrder.forEach((property) => {
      if (worker.hasOwnProperty(property)) {
        const listItem = document.createElement('li');
        listItem.textContent = property + ': ' + worker[property];
        workerList.appendChild(listItem);
      }
    });

    workerDataContainer.appendChild(workerList);

    workersContainer.appendChild(workerBox);

    // Retrieve and display the worker's image
    displayWorkerImage(workerId, workerImage);
  });
}



//============== DISPLAY THE USER DATA======================================

function displayUserData(storedUserData) {
  const userList = document.getElementById('userData');

  // Define the desired order of properties
  const propertyOrder = ['username', 'email', 'domain', 'phone_no', 'address'];

  // Create a new list item for each property in the desired order
  propertyOrder.forEach((property) => {
    if (storedUserData.hasOwnProperty(property)) {
      const listItem = document.createElement('li');
      listItem.textContent = property + ': ' + storedUserData[property];

      userList.appendChild(listItem);
    }
  });
}

//===========Display user image=============================

function displayWorkerImage(workerId, imageElement) {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(`profile-pictures/${workerId}/profilePicture.jpg`);

  imageRef
    .getDownloadURL()
    .then((url) => {
      imageElement.src = url;
    })
    .catch((error) => {
      console.error('Error retrieving worker image:', error);
    });
}


//=================SEARCH-BAR================================

document.getElementById("search-input").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) { // Check if Enter key is pressed (key code 13)
    event.preventDefault(); // Prevent form submission
    performSearch();
  }
});

document.getElementById("search-button").addEventListener("click", function() {
  performSearch();
});

function performSearch() {
  var searchTerm = document.getElementById("search-input").value;
  // Perform the search with the entered search term
  console.log("Performing search: " + searchTerm);
  // You can replace the console.log statement with your search functionality
  document.getElementById("search-input").value = ""; // Clear the search bar

}



 