const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const BLOG_URL =
"https://interviewprepforinsiders.blogspot.com";

const PAGES_JSON =
"./data/pages.json";

const PAGES_FOLDER =
"./data/pages";

function getSlug(page){

    const alternate =
    page.link.find(
        l => l.rel === "alternate"
    );

    return alternate.href
        .split("/")
        .pop()
        .replace(".html","");
}

async function syncPages(){

    try{

        const response =
        await axios.get(

           BLOG_URL +
"/feeds/pages/default?alt=json&max-results=500"

        );

        const entries =
        response.data.feed.entry || [];

        let metaPages=[];

        if(await fs.pathExists(PAGES_JSON)){

            metaPages=
            await fs.readJson(PAGES_JSON);

        }

        await fs.ensureDir(PAGES_FOLDER);

        for(const page of entries){

            const slug =
            getSlug(page);

            const alternate =
            page.link.find(
                l=>l.rel==="alternate"
            );

           const pageData={

    id:page.id.$t,

    title:page.title.$t,

    slug,

    published:page.published.$t,

    updated:page.updated.$t,

    author:
    page.author[0].name.$t,

    url:
    alternate.href,

    summary:
    page.summary
    ?
    page.summary.$t
    :
    "",

    thumbnail:
    page.media$thumbnail
    ?
    page.media$thumbnail.url
    :
    "",

    content:
    page.content.$t

};

            await fs.writeJson(

                path.join(

                    PAGES_FOLDER,

                    slug+".json"

                ),

                pageData,

                {spaces:2}

            );

            const meta={

                id:page.id.$t,

    title:page.title.$t,

    slug,

    published:page.published.$t,

    updated:page.updated.$t,

    author:
    page.author[0].name.$t,

    url:
    alternate.href,

    summary:
    page.summary
    ?
    page.summary.$t
    :
    "",

    thumbnail:
    page.media$thumbnail
    ?
    page.media$thumbnail.url
    :
    "",


            };

            const index=
            metaPages.findIndex(

                p=>p.id===meta.id

            );

            if(index>=0){

                metaPages[index]=meta;

            }

            else{

                metaPages.push(meta);

            }

        }

        await fs.writeJson(

            PAGES_JSON     ,

            metaPages,

            {spaces:2}

        );

        console.log(
            "Pages Synced Successfully"
        );

    }

    catch(err){

        console.log(err);

    }

}

module.exports=syncPages;