<div align="center">

# //TODO: Project

[![Website](https://img.shields.io/website?down_message=Offline%20%3A%28&label=App%20is&logo=heroku&style=for-the-badge&up_color=%233bad0e&up_message=Online.%20Click%20Here%21&url=https%3A%2F%2Faa-todo.herokuapp.com%2F)](https://aa-todo.herokuapp.com/)
[![Project Wiki - Click Here!](https://img.shields.io/static/v1?label=Project+Wiki&message=Click+Here!&color=%23CFD8DC&style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/juniporous/TODO-Project/wiki)

## Technologies

![JS Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3 Badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Pug](https://img.shields.io/badge/Pug-E3C29B?style=for-the-badge&logo=pug&logoColor=black)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/static/v1?label=&message=Sequelize&color=%232F406A&style=for-the-badge&logo=Sequelize&logoColor=%2303AFEF)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Adobe Photoshop](https://img.shields.io/badge/Adobe%20Photoshop-31A8FF?style=for-the-badge&logo=Adobe%20Photoshop&logoColor=black)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

</div>

<div align="center">

## About

<div>

<div align="justify">

//TODO: is a [Remember The Milk](https://www.rememberthemilk.com/) inspired full-stack web application with dynamic features catered to programmers. //TODO: lets users create groups, add members, set tasks, subtasks, and assign due dates for members. Try out the app as a Demo user by clicking on the [link](https://aa-todo.herokuapp.com/) above!

<div>

<div align="center">

## Features

<div>

<div align="justify">

- Account Signup/Login/Logout
- Personal Dashboard Created Upon Signup
- Demo User
- Create/Delete Groups
- Add/Remove Group Members
- Add New Personal/Group Tasks
- Display Tasks By Ascending Due Date
- Assign Tasks To Group Members By Having Them Become The Task Owner
- All Tasks Assigned To User Appear On Dashboard
- Task Owners Can Create/Delete Subtasks
- Edit Tasks If Task Owner
- Mark Task As Complete If Task Owner
- Search Through Tasks In Group
- Scroll Through Long List Of Tasks

<div>

<div align="center">

## Screenshots

<div>

<div align="center">

### Demo User

![demo](https://user-images.githubusercontent.com/11577850/138720984-be43bf04-c4df-484d-bd8a-d4dd87f159b3.png)

### Sign Up

![sign-up](https://user-images.githubusercontent.com/11577850/138721169-8c6443e6-cd43-4386-a2fd-12d4396572b5.png)

### Login

![login](https://user-images.githubusercontent.com/11577850/138721230-54f5a525-9729-46db-ab40-a230acecbcf5.png)

### Create Group

![create new group](https://user-images.githubusercontent.com/11577850/138721293-3de5c9d5-417c-4ff0-812d-ad3beb4765cf.png)

### Add/Remove Group Members

![add⁄removeGroupMembers](https://user-images.githubusercontent.com/11577850/138721475-4d6f78c3-bebc-47b4-8171-9e04450e4e1f.png)

### Add Tasks

![addNewTask](https://user-images.githubusercontent.com/11577850/138721510-d09c0ab1-f7b6-412b-920a-2ac9127d1a39.png)

### Search Tasks

![search](https://user-images.githubusercontent.com/11577850/138721549-7233741b-b20a-44c3-9c95-51460296ed45.png)

### Edit Task Details

![editTaskDetails](https://user-images.githubusercontent.com/11577850/138721596-d8c9a82d-df05-4deb-b699-9aaf35d4a238.png)

### Create Subtasks

![createSubTasks](https://user-images.githubusercontent.com/11577850/138723133-f83588ce-0f45-43b5-8d91-b7c050ccb7bb.png)

### Mark Task Completed

![markTaskAsCompleted](https://user-images.githubusercontent.com/11577850/138721671-2b15ae27-7b74-445d-b9de-ba7c13781ce6.png)

<div>

<div align="center">

## How To Run Locally

<div>

<div align="justify">

To run locally, you must have **NodeJS** and **Postgres** installed on your machine. Once they are installed, Download/Git Clone the repo and create an *.env* and database following the *.env.example* located in the root of the repo. Then look at the repo's *package.json* located in the root to see what packages the project is dependant on. Use `npm install` to install those dependencies. After that, use **Sequelize** to run all the migrations (`npx dotenv sequelize-cli db:migrate`) and then run all pending seeds (`npx dotenv sequelize-cli db:seed:all`). Check to see if the database was properly seeded using **psql**. If seeded correctly, run the server using `npm start`.

<div>

<div align="center">

## Dependencies

<div>

<div align="justify">

- BcryptJS - Bcrypt in JS (hash passwords).
- Cookie-Parser - Parse HTTPS request cookies.
- Csurf - Node.js CSRF protection middleware.
- Express - Node.js web framework.
- Express Session - Session middleware for Express.
- Express Validator - Validator module middleware for Express.
- HTTP Errors - Create HTTP Error Objects.
- Morgan - HTTP request logger middleware.
- Per ENV - Clean up package.json.
- Pug - HTML templating engine.
- Sequelize - ORM.
- Dotenv - Load environment variables.
- Nodemon - Development monitoring script.

<div>

<div align="center">

## Future Features

<div>

<div align="justify">

- Make overdue task name in red.
- Prevent from making task due in past.
- Indicate task have subtask on the left panel.
- Right pane subtasks are checkboxes.
- Animation.
- Improved UI/UX.
- Extended group functionality.
- NPM tests hooked to complete subtasks.

<div>


<div align="center">

## Technical Implementation

<div>

<div align="justify">

 The database schema required more forethought than any other technical aspect of this project. Thinking carefully about this led to a schema that was aligned with our front-end queries. For example, deciding early that a group owner was not a member of that group kept the group owner out of the member table. This kept our queries shorter and easier to debug when we needed to, for example, restrict non group owners from write/update/delete privileges.

<div>


<div align="center">

## Project Created By
### Nawal Ahmed

[![Nawal Ahmed - LinkedIn](https://img.shields.io/static/v1?label=Nawal+Ahmed&message=LinkedIn&color=%230077B5&style=for-the-badge&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/nawaljahmed/) [![Nawal Ahmed - GitHub](https://img.shields.io/static/v1?label=Nawal+Ahmed&message=GitHub&color=%23161B22&style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/nawaljahmed)

### Anthony Fahden

[![Anthony Fahden - LinkedIn](https://img.shields.io/static/v1?label=Anthony+Fahden&message=LinkedIn&color=%230077B5&style=for-the-badge&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/anthony-fahden-a9251260/) [![Anthony Fahden - GitHub](https://img.shields.io/static/v1?label=Anthony+Fahden&message=GitHub&color=%23161B22&style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/juniporous)

### William Short

[![William Short - LinkedIn](https://img.shields.io/static/v1?label=William+Short&message=LinkedIn&color=%230077B5&style=for-the-badge&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/will-s-231740126/) [![William Short - GitHub](https://img.shields.io/static/v1?label=William+Short&message=GitHub&color=%23161B22&style=for-the-badge&logo=GitHub&logoColor=white)](https://github.com/will-short)


<div>

<div align="center">

## Badges Found & Created Using
[Badges4 ReadMe.md Profile](https://github.com/alexandresanlim/Badges4-README.md-Profile) | [Markdown Badges](https://github.com/Ileriayo/markdown-badges) | [Badge Generator](https://michaelcurrin.github.io/badge-generator/#/generic) | [Shields.io](https://shields.io/) | [Simple Icons](https://simpleicons.org/)

<div>
