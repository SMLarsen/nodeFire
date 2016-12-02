var app = angular.module("sampleApp", ["firebase"]);
app.controller("SampleCtrl", function($firebaseAuth, $http) {
    var auth = $firebaseAuth();
    var self = this;

    self.newUser = {};

    // This code runs whenever the user logs in
    self.logIn = function() {
        auth.$signInWithPopup("google").then(function(firebaseUser) {
            console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
        }).catch(function(error) {
            console.log("Authentication failed: ", error);
        });
    };

    // This code runs whenever the user changes authentication states
    // e.g. whevenever the user logs in or logs out
    // this is where we put most of our logic so that we don't duplicate
    // the same things in the login and the logout code
    auth.$onAuthStateChanged(function(firebaseUser) {
        // firebaseUser will be null if not logged in
        if (firebaseUser) {
            console.log('user:', firebaseUser);
            // This is where we make our call to our server
            firebaseUser.getToken().then(function(idToken) {
                $http({
                    method: 'GET',
                    url: '/privateData',
                    headers: {
                        id_token: idToken
                    }
                }).then(function(response) {
                    self.secretData = response.data;
                });
            });
        } else {
            console.log('Not logged in or not authorized.');
            self.secretData = [];
        }

    });

    // This code runs when the user logs out
    self.logOut = function() {
        auth.$signOut().then(function() {
            console.log('Logging the user out!');
        });
    };

    // Runs when trying to add a new user - returns ok only if requester has appropriate clearance for requestee
    self.addUser = function() {
        if (firebaseUser) {
            console.log('add user:', firebaseUser);
            // This is where we make our call to our server
            var requestedClearance = self.newUser.clearanceLevel;
            firebaseUser.getToken().then(function(idToken, requestedClearance) {
                $http({
                    method: 'GET',
                    url: '/user',
                    headers: {
                        id_token: idToken,
                        requestedClearance: requestedClearance
                    }
                }).then(function(response) {
                    console.log('adding user:', self.newUser);
                    $http.post('/user', self.newUser)
                        .then(function(response) {
                                //good
                                console.log('user added', response.data);
                            },
                            function(response) {
                                //error
                                console.log('ERROR adding user', response.data);
                            });
                });
            });
        } else {
            console.log('Not logged in or not authorized.');
            self.secretData = [];
        }
    };
});
