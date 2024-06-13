// const { headers } = require("next/headers");
const baseUrl = "https://tarmeezacademy.com/api/v1";

let currentPage = 1;
let lastPage = 1;

// infinite scroll
// belal is here
window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});
// end infinite scroll

setupUI();
getPosts();

function userClicked(userId) {
  window.location = `profile.html?userid=${userId}`;
}
function profileCliked() {
  const user = getCrrentUser();
  const userId = user.id;
  window.location = `profile.html?userid=${userId}`;
}

//get posts

function getPosts(reload = true, page = 1) {
  // belal is here
  toggleLoader(true);
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=2&page=${page}`) // get take url
    .then(function (response) {
      toggleLoader(false);
      // handle success
      let posts = response.data.data;
      lastPage = response.data.meta.last_page; // belal is here
      if (reload) {
        // belal is here
        document.getElementById("posts").innerHTML = ""; // to make posts empty
      }
      for (const post of posts) {
        let user = getCrrentUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = ``;

        if (isMyPost) {
          editBtnContent = `
                        <button class='btn btn-danger' style='margin-left: 5px; float: right' onclick="deletePostBtnClicked('${encodeURIComponent(
                          JSON.stringify(post)
                        )}')">delete</button>

                        <button class='btn btn-secondary' style='float: right' onclick="editPostBtnClicked('${encodeURIComponent(
                          JSON.stringify(post)
                        )}')">edit</button>
                    `;
        }

        let content = `<div class="card shadow ">
                        <div class="card-header">
                        
                            <span onclick="userClicked(${
                              post.author.id
                            })" style="cursor: pointer;"> 
                            <img class="rounded-circle border border-2" src="${
                              post.author.profile_image
                            }" alt=""
                                style="width: 40px; height: 40px;">
                            <b>${post.author.name}</b>
                            </span>
                                                                            ${editBtnContent}


                        </div>
                        <div class="card-body" onclick ="postClick(${
                          post.id
                        })" style="cursor: pointer">
                            <img class="w-100" src="${post.image}" alt="">
                            <h6 class="mt-2" style="color: rgb(163, 159, 159);">${
                              post.created_at
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
  toggleLoader(1);
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
    .catch(() => {
      showAlert("username or password is incorrect", "danger");
    })
    .finally(() => {
      toggleLoader(0);
    });
}

// register
function registerBtnClicked() {
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-Password-input").value;
  const image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();

  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const headers = {
    "content-type": "multipart/form-data",
  };
  toggleLoader(1);
  axios
    .post(`https://tarmeezacademy.com/api/v1/register`, formData, {
      headers: headers,
    })
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
    })
    .finally(() => {
      toggleLoader(0);
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
    document.getElementById("nav-image").src = user.profile_image;
  }
}
// get current user

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
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  let url = ``;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }

  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("New Post Has Been Created", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

//post click by ahmed_ak
function postClick(postId) {
  window.location = `postDetails.html?postId=${postId}`;
}

//toggleLoader
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}

function editPostBtnClicked(postObject) {
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);
  document.getElementById("post-id-input").value = post.id;

  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
}

function addBtnClicked() {
  document.getElementById("post-modal-submit-btn").innerHTML = "Create";
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

// delete

function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);

  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}
// confirm delete
function confirmPostDelete() {
  const token = localStorage.getItem("token");
  const postId = document.getElementById("delete-post-id-input").value;
  const url = `${baseUrl}/posts/${postId}`;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  axios
    .delete(url, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("The Post Has Been Deleted Successfully", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

// Function to toggle dark mode and store preference in localStorage
const spanText = document.getElementById("name-posts-h1");
function toggleDarkMode() {
    var body = document.body;
    var icon = document.getElementById("toggleIcon");

    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        icon.src = "image/dark.png"; 
        icon.alt = "Dark Mode";
        localStorage.setItem('mode', 'dark');
        spanText.style.color =" rgb(227 227 227)";
    } else {
        icon.src = "image/light.png";
        icon.alt = "Light Mode";
        localStorage.setItem('mode', 'light');
        spanText.style.color = "#333";
    }
}

// Function to load the stored mode from localStorage
function loadStoredMode() {
    var storedMode = localStorage.getItem('mode');
    var body = document.body;
    var icon = document.getElementById("toggleIcon");

    if (storedMode === 'dark') {
        body.classList.add("dark-mode");
        icon.src = "image/dark.png"; 
        icon.alt = "Dark Mode";
                spanText.style.color = " rgb(227 227 227)";
    } else {
        icon.src = "image/light.png";  
        icon.alt = "Light Mode";
                spanText.style.color = "#333";
    }
}

// Load the stored mode when the page loads
window.onload = loadStoredMode;
