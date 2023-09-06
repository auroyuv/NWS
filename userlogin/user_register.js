// Your Firebase project configuration
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
 
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
const storageRef = firebase.storage().ref();


// Create a folder with the name based on the user ID
function createFolder(userId) {
  const folderRef = storageRef.child(`profile-pictures/${userId}/profilePicture.jpg`);

  folderRef
    .put(null)
    .then(() => {
      console.log('Folder created successfully');
    })
    .catch((error) => {
      console.error('Error creating folder:', error);
    });
}


// Set up our register function
function register() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;
  const full_name = document.getElementById('full_name').value;
  const phone_no = document.getElementById('phone_no').value;
  const address = document.getElementById('address').value;
  const selected_option = document.getElementById('select_options').value;

  // Validate input fields
  if (validate_email(email) === false || validate_password(password) === false) {
    alert('Please enter a valid email and password');
    return;
  }
  if (
    validate_field(full_name) === false ||
    validate_field(username) === false
  ) {
    alert('Please enter your full name and username');
    return;
  }
  if (
    validate_field(phone_no) === false ||
    validate_field(address) === false
  ) {
    alert('Please enter your phone number and address');
    return;
  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
    
  .then(function () {
      // Get the current user
      const user = auth.currentUser;

      // Add this user to Firebase Database
      const database_ref = database.ref();

      // Create User data
      const user_data = {
        full_name: full_name,
        username: username,
        email: email,
        phone_no: phone_no,
        address: address,
        domain: selected_option,
        last_login: Date.now(),
      };


      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data);

      // Create folder in Firebase Storage
      var userId = user.uid;
      createFolder(user.uid);

      // Done
      Swal.fire({
        title: 'Success',
        text: 'Account created successfully',
        icon: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 5000, // Set the timer to 5000 milliseconds (5 seconds)
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      }).then(function() {
        // Redirect to another page
        window.location.href = 'user_login.html';
      });    })
    .catch(function (error) {
      const error_message = error.message;
      alert(error_message);
    });
    
}

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  return password.length >= 6;
}

function validate_field(field) {
  return field && field.length > 0;
}
