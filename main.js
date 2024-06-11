
axios
  .get("https://tarmeezacademy.com/api/v1/posts")
  .then(function (response) {
    // handle success
    let posts = response.data.data;
    document.getElementById("posts").innerHTML = ""; // to make posts empty
    for (const post of posts) {
      console.log(post);

      let content = `<div class="card shadow ">
                        <div class="card-header">
                            <img class="rounded-circle border border-2" src="./profile-pics/profilepic.webp" alt=""
                                style="width: 40px; height: 40px;">
                            <b>belal ahmed</b>
                        </div>
                        <div class="card-body">
                            <img class="w-100" src="./placeholders/ainz-ooal-gown-overlord-thumb.jpg" alt="">
                            <h6 class="mt-2" style="color: rgb(163, 159, 159);">2 min ago</h6>
                            <h5>Best Anime Ever</h5>
                            <p>${post.body}</p>
                            <hr>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path
                                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                </svg>
                                <span>(3) comments</span>
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
