/******** Code: Store a message from Twilio in CosmosDB and return the most recent message *********/
const querystring = require('querystring');
const CosmosClient = require("@azure/cosmos").CosmosClient;
// Create a config object that contains all of the sensitive information that we need to manipulate our data.
const config = {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    databaseId: "SecretStorer",
    containerId: "secrets",
    partitionKey: {kind: "Hash", paths: ["/secrets"]}
    };

module.exports = async function (context, req) {
    /******** Code: Twilio phone number texts your message back *********/
    /*
    const queryObject = querystring.parse(req.body);
    context.res = {
        body: responseMessage
    };
    */

    // Parsing the body
    const queryObject = querystring.parse(req.body);
    // Storing the acutual message
    let message = queryObject.Body;
    // Storing the message (aka queryObject.Body) as a JSON object
    let document = {"message" : message};
    // Store the message in a document
    let items = await createDocument(document);
    // Generating a random integer that is strictly less than the length of the array of secrets
    const generateRandomSecret = Math.floor(Math.random() * items.length);
    context.log('items:', items + '\n' + 'items[generateRandomSecret]:', items[generateRandomSecret]);

    const responseMessage = `Thanks 😊! Stored your secret "${message}". 😯 Someone confessed that: ${JSON.stringify(items[generateRandomSecret].message)}`

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

// Creating a database and container.
// The container is used to store the database.
async function create(client) {
    // Use the client to create a SQL API database with an id of config.databaseId if it does not exist.
    const { database } = await client.databases.createIfNotExists({
        // The config.[value] variables are accessed from the config object you created earlier.
        id: config.databaseId
    });

    /*
    Use the client to create a container inside the database of ID config.databaseId. 
    This container will have an ID of config.containerId and a key of config.partitionKey.
    */
    const { container } = await client
    .database(config.databaseId)
    .containers.createIfNotExists(
        { id: config.containerId, key: config.partitionKey },
        { offerThroughput: 400 }
    );

}

// This function will create a new document within the...
// database container that contains the newItem data.
async function createDocument(newItem) {
    // Use the global config object to create the database and container if they do not exist.
    var { endpoint, key, databaseId, containerId } = config;
    const client = new CosmosClient({endpoint, key});
    const database = client.database(databaseId);
    const container = database.container(containerId);
    await create(client, databaseId, containerId);

    // Create and execute a query that uses SQL language to fetch the most recent data document.
    const querySpec = {
        // This SQL query requests for the "top 1" document when it is orderd by c._ts, or the timestamp, in descending order.
        // query: "SELECT top 1 * FROM c order by c._ts desc"
        // Query for all secrets inside your container.
        query: "SELECT * from c"
    };
    console.log('queries: ', querySpec.query);

    // Using the query querySpec, it will use the container we created to fetch the most recent document!
    const { resources: items } = await container.items.query(querySpec).fetchAll();

    // Create an document for your database that contains the information passed through the parameter `newItem`.
    const {resource: createdItem} = await container.items.create(newItem);

    return items;
}