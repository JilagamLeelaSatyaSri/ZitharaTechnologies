const http = require('http');
const url = require('url');
const { Client } = require('pg');

const dbConfig = {
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "satya123",
    database: "TestDB"
};

const client = new Client(dbConfig);

client.connect((err) => {
    if (err) {
        console.error('Error connecting to database', err);
        return;
    }
    console.log('Connected to database');

    const server = http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        
        const reqUrl = url.parse(req.url, true);
        const pathname = reqUrl.pathname;

        if (pathname === '/api/customers' && req.method === 'GET') {
            client.query('SELECT "S.No", "customer_name", "Age", "Phone", "Location", "Created_at" FROM public."Customer Details";', (err, result) => {
                if (err) {
                    console.error('Error executing query', err);
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'Error executing query' }));
                } else {
                    res.writeHead(200);
                    res.end(JSON.stringify(result.rows));
                }
            });
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Route not found' }));
        }
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

