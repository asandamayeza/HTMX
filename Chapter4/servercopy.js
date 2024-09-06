import express from 'express';

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.post("/search", async (req, res) => {
    const searchTerm = req.body.search.toLowerCase();

    if (!searchTerm) {
        return res.send(
            '<tr></tr>'
        );
    }
    const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const users = await response.json();

    const searchResults = users.filter((user) => {
        const name = user.name.toLowerCase();
        const email = user.email.toLowerCase();
        return name.includes(searchTerm) || email.includes(searchTerm)
    });

    //map method gets all users that have the search term included in the name and email address
    //display the results in rows (as strings - as we make use of the join method)
    const searchResultHTML = searchResults.map((user) => 
        `<tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
        </tr>`
    ).join('');

    res.send(searchResultHTML);
});

app.listen(3000, () => {
    console.log("Server is running on port: 3000");
});