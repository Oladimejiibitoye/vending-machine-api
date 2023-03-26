import app from "./app";
import { port } from "./common/config/config";

// start express server
app.listen(port)

console.log(`Express server has started on port ${port}.`)