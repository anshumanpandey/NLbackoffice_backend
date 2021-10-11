import { Handler } from "express"
import { ApiError } from "../utils/ApiError";
 
// Create the collection of api keys
const apiKeys = new Map();
apiKeys.set('5da9a68d-47dd-4923-8af6-5e5efe1205d2', {
  id: 1,
  name: 'app1',
  secret: 'secret1'
});
 
export const ApiKeyValidator: Handler = (req, _, next) => {
  if (req.headers.authorization === undefined) {
    next(new ApiError("Invalid API key", 401))
  } else if (apiKeys.has(req.headers.authorization) === false) {
    next(new ApiError("Invalid API key", 401))
  } else {
    next()
  }

}