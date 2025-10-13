const API_URL = "/api/posts";
const postsContainer = document.getElementById("posts-container");
const createBtn = document.getElementById("createBtn");

async function fetchPosts() {
  const res = await fetch(API_URL);
  const posts = await res.json();
  postsContainer.innerHTML = posts.map(p => `
    <div class="post">
      <h3>${p.title}</h3>
      <p>${p.content}</p>
      <small>${new Date(p.date).toLocaleString()}</small><br>
      <button onclick="editPost('${p._id}')">✏️ Edit</button>
      <button onclick="deletePost('${p._id}')">🗑️ Delete</button>
    </div>
  `).join("");
}

createBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  if (!title || !content) return alert("Please fill all fields!");

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  fetchPosts();
});

async function deletePost(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchPosts();
}

async function editPost(id) {
  const title = prompt("Enter new title:");
  const content = prompt("Enter new content:");
  if (title && content) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    fetchPosts();
  }
}

fetchPosts();
