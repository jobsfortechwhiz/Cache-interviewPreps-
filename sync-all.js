const fs = require("fs-extra");

const syncPosts = require("./sync-posts");
const syncPages = require("./sync-pages");

(async () => {

    console.log("Sync Started...");

    const postCount = await syncPosts();

    const pageCount = await syncPages();

    await fs.writeJson(

        "./data/archive.json",

        {

            generatedAt: new Date().toISOString(),

            totalPosts: postCount,

            totalPages: pageCount,

            version: "1.0.0"

        },

        { spaces: 2 }

    );

    console.log("Archive Updated");

})();


