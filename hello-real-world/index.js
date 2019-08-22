const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

function startServer() {
    const app = express();

    app.use('/hello', (_, res) => res.end('REAL WORLD'));

    const port = process.env.PORT;
    app.listen(port, () => {
	console.info(`Server started at http://localhost:${port}`);
    });
}

if (require.main === module) {
    startServer();
}
