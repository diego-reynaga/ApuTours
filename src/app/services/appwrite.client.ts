import { Client, Databases, Functions } from 'appwrite';
import { environment } from '../../environments/environment';

const client = new Client()
  .setEndpoint(environment.appwriteEndpoint)
  .setProject(environment.appwriteProjectId);

export const AppwriteClient = client;
export const AppwriteDatabases = new Databases(client);
export const AppwriteFunctions = new Functions(client);

export default client;
