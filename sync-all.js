const syncPosts =
require("./sync-posts");

const syncPages =
require("./sync-pages");

(async()=>{

    console.log(
        "Sync Started..."
    );

    await syncPosts();

    await syncPages();

    console.log(
        "All Sync Completed"
    );

})();