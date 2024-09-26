
const { MongoClient} = require('mongodb');

async function main() {

  const uri = "mongodb+srv://magallaneskim774:tkldzYzTEePhn7jq@cluster0.ioqtd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const client = new MongoClient(uri);


  try{
  await client.connect();

  // await createListing(client,{
  //   name:"Lovely loft",
  //   summary:"A charming loft in Philippines",
  //   bedrooms: 1,
  //   bathrooms:1
  // })

    await findListingWithMinBedroom(client,{
      minimumNumberOfBathrooms: 2,
      minimumNumberOfBedrooms: 4,
      maximumNumberOfResults: 5
    });

  }catch (e){
    console.error(e);
  }finally{
    await client.close();
  }

}

main().catch(console.error);

  async function findListingWithMinBedroom(client,{
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
  } = {}) {
    
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
      bedrooms:{ $gte:minimumNumberOfBedrooms},
      bathrooms:{ $gte:minimumNumberOfBathrooms}
    })
    .sort({ last_review: -1})
    .limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    
    if (results.length > 0) {
      console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
      
      results.forEach((result, i) => {
          const date = new Date(result.last_review).toDateString();

          console.log();
          console.log(`${i + 1}. name: ${result.name}`);
          console.log(`   _id: ${result._id}`);
          console.log(`   bedrooms: ${result.bedrooms}`);
          console.log(`   bathrooms: ${result.bathrooms}`);
          console.log(`   most recent review date: ${date}`);
      });
  } else {
      console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
  }
    
  }

  async function findOneListingByName(client, nameOfListing){
    const result = await client.db("sample_airbnb").collection("listingAndReviews").findOne({
      name:nameOfListing
    });
    if(result){
      console.log(`found a listing in the collection with the name '${nameOfListing}'`);
      console.log(result)
    } else{
      console.log(`No listing was found with the name '${nameOfListing}'`);
    }

  }


  async function createMultipleListings(client, newListings){
    const result = await client.db("sample_airbnb").collection("listingAndReviews").insertMany(newListings);
    console.log(`${result.insertedCount} new Listings created with the following id(s):`);
    console.log(result.insertedIds);
  }

  async function createListing(client,newListing) {
  const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

  console.log(`New listing with the following id: ${result.insertedId}`);
} 

async function listDatabases(client){
  const databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => {
    console.log(`- ${db.name}`);
  });
} 