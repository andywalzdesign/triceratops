## Testing workflow ##

Travis CI is setup to run tests automatically on each pull request to the main repo and build.

### Server tests ###
Server tests live in the tests folder:
  server-tests.js
  api-tests.js
  database-tests.js

tests are written in using Mocha as a taskrunner and Chai as an assertion library

A block of functionality should be tested by writing one describe block per piece of functionality. Use nested it statements to test each aspect of the piece you are testing.

The chai expect library is loaded along with a request library for making HTTP requests to endpoints

//EXAMPLE TEST TO GET USERS:
  describe('FUNCTIONALITY_TO_TEST', function(){
    it('DESCRIBE_WHAT_FUNCTIONALITY_SHOULD_BE_DOING', function(){
      request.get('API_ENDPOINT_TO_TEST', function(err, res, body){
        if(err){
          console.log("ERROR", err);
        }
        expect(res.body).to.exist;
        done();
      });
    });
  });

You can also write out helpful functions to return data to test at the top or bottom of the test file

#### to run code against all tests locally: ####

check that all servers/databases the app needs are running
run 'npm test' from the main directory in terminal

### App tests ###
App tests live in the app/__tests__ folder
  index.ios.js
  NEED TO SPLIT FILES INTO TEST FILES FOR EACH COMPONENT

Tests are written using Jest. See the list of expectations you can use to test output here: https://facebook.github.io/jest/docs/expect.html#content

An important concept of testing functions inside of components in React is 'mocks' --NEED TO GET A BETTER GRASP ON THEM AND AN EXAMPLE SETUP

A block of functionality should be tested by writing one describe block per piece of functionality. Use nested it statements to test each aspect of the piece you are testing.

#### to run code against all tests locally ####
check that all the servers/databases are running
run npm test from the app directory



run 'npm test' from the main directory in terminal

OTHER NOTES:
Need to export the path to './App.js' from index file for tests to be able to pass
