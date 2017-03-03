var api = {
  getExperts(category) {
    console.log('getExperts', category);
    var cat = category.toLowerCase().trim();
    var local = `http://localhost:2300/api/users/topActiveExperts/${cat}/5`;
    var heroku = `https://savvyshopper.herokuapp.com/api/users/topActiveExperts/${cat}/5`;
    var herokuTest = `https://murmuring-sierra-59020.herokuapp.com/api/users/topActiveExperts/${cat}/5`;
    return fetch(heroku).then((res) => res.json()).then(function(results) {
      console.log('results', results);
      return results;
    });
  }
};

module.exports = api;