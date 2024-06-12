//get posts
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
                            <img class="rounded-circle border border-2" src="${
                              post.author.profile_image
                            }" alt=""
                                style="width: 40px; height: 40px;">
                            <b>${post.author.name}</b>
                        </div>
                        <div class="card-body">
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
                                <span>(${post.comments_count}) comments</span>
                            </div>
                        </div>
                    </div>
        `;
      document.getElementById("posts").innerHTML += content; //+= to update data in loop
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });



// post take url and body

// login 
function loginBtnClicked()
{
const username = document.getElementById("Username-input").value;
const password = document.getElementById("Password-input").value
const params ={
    "username": username,
  "password": password
}
  axios.post(`https://tarmeezacademy.com/api/v1/login`, params)
  .then((response) => {
  console.log(response.data)
  })
}