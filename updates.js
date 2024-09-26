const {MongoClient} = require('mongodb');

async function main(){

    const uri = "mongodb+srv://magallaneskim774:tkldzYzTEePhn7jq@cluster0.ioqtd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);

    try{
        await client.connect();
        await updatedListingByName(client);

    } catch(e){
        console.error(e);
    } finally{
        await client.close();
    }
}

    main().catch(console.error);

    async function updatedListingByName(client) {
        const result = await client.db("sample_airbnb").collection("listingsAndReviews")
        .updateMany({ property_type:{ $exists: false }}, 
                    { $set: { property_type: "unknown"} });

        console.log(`${result.matchedCount} document(s) matched the query criteria.`);
        console.log(`${result.modifiedCount} document(s) was/were updated.`);

    }