CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(80) UNIQUE NOT NULL,
    password VARCHAR(80) NOT NULL
);


INSERT INTO "user" (email, password) VALUES ('test@gmail.com', 'password');