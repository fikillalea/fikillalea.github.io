// Add new posts to this array after adding the markdown file to posts/
const posts = [
  {
    slug: "sample-post",
    title: "Sample Writing Post",
    date: "30 March 2026",
    file: "posts/sample-post.md",
    excerpt: "A short sentence or two for this post.",
  },
];

const md = window.markdownit({ html: true, linkify: true });
const postListEl = document.getElementById("post-list");
const postContentEl = document.getElementById("post-content");
const postErrorEl = document.getElementById("post-error");
const writingStateEl = document.getElementById("writing-state");

function buildPostList() {
  postListEl.innerHTML = "";
  posts.forEach((post) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `?post=${post.slug}`;
    link.textContent = post.title;

    const date = document.createElement("div");
    date.className = "post-date";
    date.textContent = post.date;

    const excerpt = document.createElement("p");
    excerpt.className = "post-excerpt";
    excerpt.textContent = post.excerpt;

    li.appendChild(link);
    li.appendChild(date);
    li.appendChild(excerpt);
    postListEl.appendChild(li);
  });
}

async function loadPost(slug) {
  const postMeta = posts.find((p) => p.slug === slug);
  if (!postMeta) {
    showError(`No post found with slug '${slug}'.`);
    return;
  }
  try {
    const res = await fetch(postMeta.file);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const content = await res.text();
    postContentEl.style.display = "block";
    postContentEl.innerHTML = md.render(content);
    postErrorEl.style.display = "none";
    writingStateEl.textContent = `Viewing: ${postMeta.title}`;
    postListEl.style.display = "none";
  } catch (error) {
    showError(`Unable to load post: ${error.message}`);
  }
}

function showError(message) {
  postErrorEl.textContent = message;
  postErrorEl.style.display = "block";
  postContentEl.style.display = "none";
  writingStateEl.textContent = "";
}

function clearPost() {
  postErrorEl.style.display = "none";
  postContentEl.style.display = "none";
  postListEl.style.display = "block";
  writingStateEl.textContent = "";
}

function initWriting() {
  buildPostList();

  const params = new URLSearchParams(window.location.search);
  const selected = params.get("post");

  if (selected) {
    loadPost(selected);
  } else {
    clearPost();
  }
}

initWriting();
