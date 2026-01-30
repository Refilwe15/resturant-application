## Project Overview

An application designed to manage restaurant operations, including menu management, order handling, customer management, and reporting. This app aims to streamline restaurant processes, enhance customer experience, and improve operational efficiency.

## Key Features

```Admin```

- Full access to manage menus, orders, and user accounts.

```Customers```

- Can browse the menu, place orders, and provide feedback.

- Customer registration and login.

- View order history and manage account details.


## Tech Stack

``` Frontend ```

- React Native

- CSS 

``` Backend ```

- SQLite

- Postgres

- Typescript

- Strip epayment gateway

- Multer (handling Picture Getaway)

- JWT(authentication and authourisation)

- Express Web API 

## Figma Design Link

- https://www.figma.com/design/Le3OeHlQ6aHE4AaspGGIGy/Resturant-App?node-id=1-3&p=f&t=FkIDPj8xvBG4DJ2t-0


## How to run the app

# Prerequisites
.env file 

```
PORT=8000
DB_HOST=localhost
DB_NAME=postgres database name
DB_USER=postgres database user
DB_PASSWORD=postgres database password
JWT_SECRET=supersecretkey
STRIPE_SECRET_KEY=your stripe private key



```

# clone and run 

```
git clone https://github.com/Refilwe15/resturant-application.git

cd resturant-application

cd backend

npm install

npx tsx watch server.ts

cd ..

cd frontend

npm install

npx expo start

```

## Run admin side


``` 

http://localhost:8000/admin

## ADMIN LOGIN CREDENTIALS ##

email : a@a.com
password : 1234


