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
// Get a reference to the Firebase Storage service
var storage = firebase.storage();

$(document).ready(function() {
  var availableTags = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli (Trichy)", "Salem", "Tirunelveli", "Erode", "Vellore", "Tiruppur", "Thoothukudi (Tuticorin)", "Thanjavur", "Dindigul", "Cuddalore", "Kanchipuram", "Karur", "Namakkal", "Neyveli", "Ooty (Udhagamandalam)", "Rameswaram", "Kanyakumari", "Pollachi", "Nagapattinam", "Krishnagiri", "Dharmapuri", "Kumbakonam", "Hosur", "Karaikudi", "Pudukkottai", "Villupuram", "Nagercoil", "Thiruvallur", "Mayiladuthurai", "Sivakasi", "Tiruvannamalai", "Tenkasi", "Tirupathur", "Rajapalayam", "Virudhunagar", "Arakkonam", "Gobichettipalayam", "Tiruvottiyur", "Puducherry (Pondicherry)", "Tirupathur", "Ambur", "Vaniyambadi", "Sivaganga", "Perambalur", "Mettur", "Thiruvarur", "Thiruthani", "Aruppukkottai", "Nagarkoil", "Thiruverumbur", "Nellai", "Thirupunavasal", "Thiruverkadu", "Thiruchendur", "Thirukkuvalai", "Thirukalukundram", "Thiruthangal", "Thirumayam", "Thirumangalam", "Thiruparankundram", "Thiruporur", "Thiruthuraipoondi", "Thirukarungudi", "Thirumazhisai", "Thirukattupalli", "Thirupuvanam", "Thiruvaiyaru"
  ];

  $("#city").autocomplete({
    source: availableTags
  });
});

// Create a folder with the name based on the user ID


// Set up our register function
function register() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;
  const full_name = document.getElementById('full_name').value;
  const phone_no = document.getElementById('phone_no').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const date_of_birth = document.getElementById('date_of_birth').value;
  const gender = document.getElementById('gender').value;
  const marital_status = document.getElementById('marital_status').value;
  const nationality = document.getElementById('nationality').value;
  const job_title = document.getElementById('job_title').value;
  const available_time = document.getElementById('available_time').value;
  const about_you = document.getElementById('about_you').value;


  // Validate input fields
  if (validate_email(email) === false || validate_password(password) === false) {
    alert('Please enter a valid email and password');
    return;
  }
  if (
    validate_field(full_name) === false || validate_field(username) === false
  ) {
    alert('Please enter your full name or username');
    return;
  }
  if (validate_field(city) === false || validate_field(address) === false) {
    alert('Please enter your ciry and address');
    return;
  }
  if( validatePhoneNumber(phone_no) == false){
    alert('Please enter valid phone number');
  }


  // Move on with Auth
  auth
    .createUserWithEmailAndPassword(email, password)
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
        date_of_birth: date_of_birth,
        gender: gender,
        marital_status: marital_status,
        nationality: nationality,
        job_title: job_title,
        available_time: available_time,
        city: city,
        address: address,
        about_you: about_you,
        

        last_login: Date.now(),
      };


      // Push to Firebase Database
      database_ref.child('workers/' + user.uid).set(user_data);

      // Create folder in Firebase Storage
      var userId = user.uid;
      
      uploadDefaultPicture(userId)

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
        window.location.href = 'worker_login.html';
      });      
    })
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
function validatePhoneNumber(phoneNumber) {
  // Regular expression pattern for phone number validation
  var pattern = /^[0-9]{10}$/;

  // Validate the phone number against the pattern
  var isValid = pattern.test(phoneNumber);

  return isValid;
}

//=======================================================
//UPLOAD DEFAULT IMAGE TO THE FIREBASE===================

function uploadDefaultPicture(userId) {
  const storageRef = firebase.storage().ref();
  const defaultPicture = '../image/profilePicture.jpg'; // Path to your default picture file

  const imageRef = storageRef.child(`profile-pictures/${userId}/profilePicture.jpg`);
  const uploadTask = imageRef.put(defaultPicture);

  uploadTask.then(() => {
    console.log('Default picture uploaded successfully!');
  }).catch((error) => {
    console.error('Error uploading default picture:', error);
  });
}


