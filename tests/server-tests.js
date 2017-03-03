// var chai = require('chai');
// var expect = require('chai').expect;
// var request = require('request');

// //
// // TESTS
// //
// describe('users routes', () => {
//   it('should have a users route', (done) => {
//     request.get('http://localhost:2300/api/users', function(err, res, body){
//       if(err){
//         console.log("ERROR", err);
//       }
//       expect(res.body).to.exist;
//       done();
//     });
//   });
//   it('should load a specific user', (done) => {
//     request.get('http://localhost:2300/api/users/1', function(err, res, body){
//       if(err){
//         console.log("ERROR", err);
//       }
//       expect(JSON.parse(res.body)[0].username).to.equal('triceratops1@gmail.com');
//       done();
//     });
//   });
// });
// //
// // HELPER FUNCTIONS
// //
// var dummyTest = (function(){
//   if(1 + 1 === 2){
//     console.log("\'Test\' test passes");
//   } else {
//     throw new Error("We got trouble, right here in River City");
//   }
// })();