const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const BLOG_URL =
"https://interviewprepforinsiders.blogspot.com";

const POSTS_JSON =
"./data/posts.json";

const POSTS_FOLDER =
"./data/posts";

function getSlug(post){

    const alternate =
    post.link.find(
        l => l.rel === "alternate"
    );

    return alternate.href
        .split("/")
        .pop()
        .replace(".html","");
}

async function syncPosts(){

    try{

        const response =
        await axios.get(

            BLOG_URL +
            "/feeds/posts/default?alt=json&max-results=500"

        );

        const entries =
        response.data.feed.entry || [];

        let metaPosts=[];

        if(await fs.pathExists(POSTS_JSON)){

            metaPosts=
            await fs.readJson(POSTS_JSON);

        }

        await fs.ensureDir(POSTS_FOLDER);

        for(const post of entries){

            const slug =
            getSlug(post);

            const alternate =
            post.link.find(
                l=>l.rel==="alternate"
            );

            const postData={

                id:post.id.$t,

                title:post.title.$t,

                slug,

                published:post.published.$t,

                updated:post.updated.$t,

                author:
                post.author[0].name.$t,

                labels:
                post.category
                ?
                post.category.map(
                    c=>c.term
                )
                :
                [],

                url:
                alternate.href,

                summary:
                post.summary
                ?
                post.summary.$t
                :
                "",

                thumbnail:
                post.media$thumbnail
                ?
                post.media$thumbnail.url
                :
                "",

                content:
                post.content.$t

            };

            await fs.writeJson(

                path.join(

                    POSTS_FOLDER,

                    slug+".json"

                ),

                postData,

                {spaces:2}

            );

            const meta={

                id:post.id.$t,

                title:post.title.$t,

                slug,

                published:post.published.$t,

                updated:post.updated.$t,

                author:
                post.author[0].name.$t,

                labels:
                post.category
                ?
                post.category.map(
                    c=>c.term
                )
                :
                [],

                url:
                alternate.href,

                thumbnail:
                post.media$thumbnail
                ?
                post.media$thumbnail.url
                :
                ""

            };

            const index=
            metaPosts.findIndex(

                p=>p.id===meta.id

            );

            if(index>=0){

                metaPosts[index]=meta;

            }

            else{

                metaPosts.push(meta);

            }

        }

        await fs.writeJson(

            POSTS_JSON,

            metaPosts,

            {spaces:2}

        );

        console.log(
            "Posts Synced Successfully"
        );

    }

    catch(err){

        console.log(err);

    }

}

module.exports=syncPosts;