axios
  .get("https://tarmeezacademy.com/api/v1/posts")
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
