 
 
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
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  
  
  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Please enter valid email or password')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('workers/' + user.uid).update(user_data)
  
      // Done
      //redirect to profile page
      window.location.href = "../homepage/user_home.html";
    
      
  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  
  
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }
