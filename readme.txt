this todo-list was made by Ilay Rosenstein using template and guidness from Angela Yu
In the Complete 2022 Full-Stack Web Development Boot Camp.

technologies used in the project:
1. HTML
2. CSS
3. JavaScript
4. Node.JS
5. mongoDB

npm's used:
    1. body-parser
    2. ejs
    3. express
    4. lodash
    5. mongoose

How it works:
the todo-list uses mongoDB to store tasks from post request.
and then show the data back in the list. the server renders the list page every time there's a "get" request for a spesific URL ("/:list-name).
if the specific URL does not have a list, it will create a new list in the DB.

IMPORTANT!
install the npm's before running the server with (npm install).
package.json is in the repo.