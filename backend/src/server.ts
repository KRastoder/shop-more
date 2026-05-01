import app from "./app";

const PORT = 8000;
const HOST = "0.0.0.0";

console.log(`Attempting to listen on ${HOST}:${PORT}...`);
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
