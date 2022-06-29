const WRAPPER_KEY = "sp-wrap";
const PSA_PARTIAL_URL = "psa";
const BASE_URL = "https://torlock2.com";

function parseFilename(filename) {
  const [key] = filename.match(/S\d{2}E\d{2}/g) || [];
  const [joinedShowName] = filename.split(key);
  const showName = joinedShowName.slice(0, -1).split(".").join(" ");
  const [quality] = filename.match(/720p|1080p|2160p/g) || [];
  return { key, showName, quality };
}

async function search(query) {
  const response = await fetch(
    `https://torrent-query.herokuapp.com/?q=${query.replace(/ /g, "+")}`
  );
  if (!response.ok) return {};
  return await response.json();
}

async function fetchTorrent(event) {
  const query = event.target.getAttribute("query");
  const body = event.target.parentNode.children[1];

  const p = document.createElement("p");
  body.appendChild(p);

  const a = document.createElement("a");
  a.style.fontSize = "16px";
  a.href = BASE_URL + "?q=" + query.replace(/ /g, "+");
  a.textContent = "Find in Torklock";
  body.appendChild(a);

  // const { url, hash, source } = await search(query);

  // if (source) {
  //   const p = document.createElement("p");
  //   body.appendChild(p);

  //   const a = document.createElement("a");
  //   a.style.fontSize = "16px";
  //   a.href = source;
  //   a.textContent = source;
  //   body.appendChild(a);
  // }

  // if (url) {
  //   const p = document.createElement("p");
  //   body.appendChild(p);

  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.textContent = "Torlock torrent";
  //   body.appendChild(a);
  // }

  // if (hash) {
  //   const p = document.createElement("p");
  //   body.appendChild(p);

  //   const span = document.createElement("span");
  //   span.textContent = `INFO HASH: (${hash})`;
  //   body.appendChild(span);
  // }
}

async function main() {
  if (location.origin.includes(PSA_PARTIAL_URL)) {
    Array.prototype.forEach.call(
      document.getElementsByClassName(WRAPPER_KEY),
      (wp) => {
        const [head, body] = wp.children;
        const { key, showName, quality } = parseFilename(head.textContent);
        const query = `${showName} ${key} ${quality} x265`;
        head.setAttribute("query", query);
        head.addEventListener("click", fetchTorrent);
      }
    );
  }
}

main();
