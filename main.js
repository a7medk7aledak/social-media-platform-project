// const { headers } = require("next/headers");

setupUI();
getPosts();
//get posts
function getPosts() {
  axios
    .get("https://tarmeezacademy.com/api/v1/posts") // get take url
    .then(function (response) {
      // handle success
      let posts = response.data.data;
      document.getElementById("posts").innerHTML = ""; // to make posts empty
      for (const post of posts) {
        console.log(post);

        let content = `<div class="card shadow ">
                        <div class="card-header">
                            <img class="rounded-circle border border-2" src="${post.author.profile_image
          }" alt=""
                                style="width: 40px; height: 40px;">
                            <b>${post.author.name}</b>
                        </div>
                        <div class="card-body">
                            <img class="w-100" src="${post.image}" alt="">
                            <h6 class="mt-2" style="color: rgb(163, 159, 159);">${post.created_at
          }</h6>
                            <h5>${post.title === null ? "" : post.title}</h5> 
                            <p>${post.body}</p>
                            <hr>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path
                                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                </svg>
                                <span>(${post.comments_count}) comments
                                  <span id="post-tags-${post.id}">
                                    <button class= "btn btn-sm rounded-5" style="background-color: gray;color:#ffff">policy</button>
                                  </span>
                                </span>
                            </div>
                        </div>
                    </div>
        `;
        document.getElementById("posts").innerHTML += content; //+= to update data in loop
        let currentPostTagsId = `post-tags-${post.id}`;
        document.getElementById(currentPostTagsId).innerHTML = "";
        for (const tag of post.tags) {
          let tagsContent = ` <button class= "btn btn-sm rounded-5" style="background-color: gray;color:#ffff">${tag.name}</button>
        `;
          document.getElementById(currentPostTagsId).innerHTML += tagsContent;
        }
      }
    })
    .catch(function (error) {
      axios;
      console.log(error);
    });
}

// post take url and body

// login
function loginBtnClicked() {
  const username = document.getElementById("Username-input").value;
  const password = document.getElementById("Password-input").value;
  const params = {
    username: username,
    password: password,
  };
  axios
    .post(`https://tarmeezacademy.com/api/v1/login`, params)
    .then((response) => {
      // save token in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("login-modal");
      const modalinstance = bootstrap.Modal.getInstance(modal);
      modalinstance.hide();
      setupUI();
      showAlert("logged in successfully", "success");
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

// register
function registerBtnClicked() {
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-Password-input").value;
  const params = {
    username: username,
    password: password,
    name: name,
  };
  axios
    .post(`https://tarmeezacademy.com/api/v1/register`, params)
    .then((response) => {
      // save token in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("register-modal");
      const modalinstance = bootstrap.Modal.getInstance(modal);
      modalinstance.hide();
      setupUI();
      showAlert("New User registerd Successfully", "success");
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

// function to show success alert
function showAlert(customeMessage, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  alert(customeMessage, type);

  // setTimeout(() => {
  //   const alertToHide = bootstrap.Alert.getOrCreateInstance(
  //     "#liveAlertPlaceholder"
  //   );
  //   alertToHide.close();
  // }, 3000);
}
// end success alert

// function to show and hide login button and logout button depend on tokens
function setupUI() {
  const token = localStorage.getItem("token");
  const logedindDiv = document.getElementById("logedin-div");
  const logoutDiv = document.getElementById("logout-div");
  // add button in  create post ...By Ahmed_ak
  const addBtn = document.getElementById("add-btn");
  if (token == null) {
    addBtn.style.setProperty("display", "none", "important"); // ahmed_ak
    logedindDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    addBtn.style.setProperty("display", "block", "important"); // ahmed_ak
    logedindDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    const user = getCrrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
  }
}
// get current user
function getCrrentUser() {
  let user = null;
  let storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

// logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  showAlert("logged out successfully", "success");
}

// create new post
function createNewPostClicked() {
  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0]; //get first image using file(s)
  const token = localStorage.getItem("token");
  //to send form data not json
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/from-data",
    authorization: `Bearer ${token}`,
  };
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts`, formData, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("create-post-modal");
      const modalinstance = bootstrap.Modal.getInstance(modal);
      modalinstance.hide();
      showAlert("New Post Has Been Created", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}
