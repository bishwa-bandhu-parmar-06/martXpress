import { Client } from "@opensearch-project/opensearch"; // Swapped import
import dotenv from "dotenv";
import colors from "colors";

dotenv.config();

// Initialize the OpenSearch client using your Bonsai URL
export const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
});

// Test the connection when the server starts
const testConnection = async () => {
  try {
    const info = await esClient.info();
    console.log(`Bonsai Search Connected: Cluster is active!`.cyan.underline);
  } catch (error) {
    console.error("Bonsai Search Connection Failed:".red.bold, error.message);
    console.log("Check if your ELASTICSEARCH_URL in .env is correct.".yellow);
  }
};

testConnection();
