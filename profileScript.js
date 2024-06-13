getUser();
setupUI();
getPosts();

getCurrentUserId();

function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}

function getUser() {
  const id = getCurrentUserId();
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response) => {
      const user = response.data.data;
      document.getElementById("main-info-email").innerHTML = user.email;
      document.getElementById("main-info-name").innerHTML = user.name;
      document.getElementById("main-info-username").innerHTML = user.username;
      document.getElementById("main-info-image").src = user.profile_image;
      document.getElementById("name-posts").innerHTML = user.username;

      // posts and comment cont
      document.getElementById("number-info").innerHTML = user.posts_count;
      document.getElementById("comment-info").innerHTML = user.comments_count;
    });
}

function getPosts() {
  const id = getCurrentUserId();
  toggleLoader(true);

  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    .then((response) => {
      toggleLoader(false);

      const posts = response.data.data;
      document.getElementById("user-posts").innerHTML = "";
      for (post of posts) {

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
        document.getElementById("user-posts").innerHTML += content; //+= to update data in loop
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

//toggleLoader
function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}

// Function to toggle dark mode and store preference in localStorage
function toggleDarkMode() {
    var body = document.body;
    var icon = document.getElementById("toggleIcon");
    let spanText = document.getElementById("name-posts-h1");
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        icon.src = "image/dark.png"; 
        icon.alt = "Dark Mode";
        localStorage.setItem('mode', 'dark');
        spanText.style.color ="#ffff"
    } else {
        icon.src = "image/light.png";
        icon.alt = "Light Mode";
        localStorage.setItem('mode', 'light');
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
    } else {
        icon.src = "image/light.png";  
        icon.alt = "Light Mode";
    }
}

// Load the stored mode when the page loads
window.onload = loadStoredMode;

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
