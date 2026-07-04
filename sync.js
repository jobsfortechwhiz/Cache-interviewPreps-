const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const BLOG_URL =
"https://interviewprepforinsiders.blogspot.com";

const POSTS_JSON =
"./data/posts.json";

const POSTS_FOLDER =
"./data/posts";

async function syncPosts(){

    try{

        const url =
        BLOG_URL +
        "/feeds/posts/default?alt=json&max-results=500";

        const response =
        await axios.get(url);

        const entries =
        response.data.feed.entry || [];

        console.log(
            "Total Blogger Posts :",
            entries.length
        );

        // Read existing metadata
        let metaPosts = [];

        if(await fs.pathExists(POSTS_JSON)){

            metaPosts =
            await fs.readJson(POSTS_JSON);

        }

        await fs.ensureDir(POSTS_FOLDER);

        for(const post of entries){

            const alternate =
            post.link.find(
                l=>l.rel==="alternate"
            );

            const slug =
            alternate.href
            .split("/")
            .pop()
            .replace(".html","");
            const pageData = {

    id: page.id.$t,

    title: page.title.$t,

    slug: slug,

    published: page.published.$t,

    updated: page.updated.$t,

    author: page.author[0].name.$t,

    url: alternate.href,

    summary:
        page.summary
            ? page.summary.$t
            : "",

    thumbnail:
        page.media$thumbnail
            ? page.media$thumbnail.url
            : "",

    content: page.content.$t

};

          const postData = {

    id: post.id.$t,

    title: post.title.$t,

    slug: slug,

    published: post.published.$t,

    updated: post.updated.$t,

    author: post.author[0].name.$t,

    labels: post.category
        ? post.category.map(c => c.term)
        : [],

    url: alternate.href,

    summary:
        post.summary
            ? post.summary.$t
            : "",

    thumbnail:
        post.media$thumbnail
            ? post.media$thumbnail.url
            : "",

    content: post.content.$t

};

            // ---------- Save Individual JSON ----------

            await fs.writeJson(

                path.join(
                    POSTS_FOLDER,
                    slug + ".json"
                ),

                postData,

                {spaces:2}

            );

            // ---------- Update Metadata ----------

            // const index =
            // metaPosts.findIndex(   instead of comparing by slug taking blogger post id which won't change
            //     p=>p.slug===slug
            // );

            const bloggerId = post.id.$t;

const index =
metaPosts.findIndex(
    p => p.id === bloggerId
);

const pageMeta = {

    id: page.id.$t,

    title: page.title.$t,

    slug: slug,

    published: page.published.$t,

    updated: page.updated.$t,

    url: alternate.href,

    thumbnail:
        page.media$thumbnail
            ? page.media$thumbnail.url
            : ""

};
const meta = {

    id: post.id.$t,

    title: post.title.$t,

    slug: slug,

    published: post.published.$t,

    updated: post.updated.$t,

    labels: post.category
        ? post.category.map(c => c.term)
        : [],

    url: alternate.href,

    thumbnail:
        post.media$thumbnail
            ? post.media$thumbnail.url
            : ""

};
            if(index>=0){

                metaPosts[index]=meta;

                console.log(
                    "Updated:",
                    slug
                );

            }else{

                metaPosts.push(meta);

                console.log(
                    "Added:",
                    slug
                );

            }

        }

        // Save posts.json

        await fs.writeJson(

            POSTS_JSON,

            metaPosts,

            {spaces:2}

        );

        console.log("\nSync Completed Successfully");

    }

    catch(err){

        console.log(err);

    }

}

syncPosts();


//=================================================================
// const axios = require("axios");
// const fs = require("fs-extra");
// const path = require("path");

// const BLOG_URL =
// "https://interviewprepforinsiders.blogspot.com";

// async function generateOnePost() {

//     const url =
//         BLOG_URL +
//         "/feeds/posts/default?alt=json&max-results=500";

//     const response = await axios.get(url);

//     const post = response.data.feed.entry[0];   // First post only

//     // Find Blogger URL
//     const alternate =
//         post.link.find(l => l.rel === "alternate");

//     // Extract slug
//     const slug = alternate.href
//         .split("/")
//         .pop()
//         .replace(".html", "");

//     const postData = {

//         id: post.id.$t,

//         title: post.title.$t,

//         slug: slug,

//         updated: post.updated.$t,

//         content: post.content.$t

//     };

//     // Ensure folder exists
//     await fs.ensureDir("./data/posts");

//     // Save JSON
//     await fs.writeJson(
//         path.join("./data/posts", slug + ".json"),
//         postData,
//         { spaces: 2 }
//     );

//     console.log("Created:", slug + ".json");

// }

// generateOnePost();


//==========================================================
// const slug =
// new URLSearchParams(location.search)
// .get("slug");

// fetch(
// "/data/posts/" + slug + ".json"
// )
// .then(r=>r.json())
// .then(post=>{

// document.title=post.title;

// content.innerHTML=
// post.content;

// });
//===========================================
//showed all blogger post titles
// const axios = require("axios");

// const BLOG_URL =
// "https://interviewprepforinsiders.blogspot.com";

// async function test() {

//     try {

//         const url =
//             BLOG_URL +
//             "/feeds/posts/default?alt=json&max-results=500";

//         const response = await axios.get(url);

//         console.log("Feed Loaded Successfully");
//         console.log("Total Posts :", response.data.feed.entry.length);

//         response.data.feed.entry.forEach((post, index) => {

//             console.log(
//                 index + 1,
//                 post.title.$t
//             );

//         });

//     } catch (err) {

//         console.error(err.message);

//     }

// }

// test();