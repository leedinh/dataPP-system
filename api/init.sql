CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(80) UNIQUE NOT NULL,
    hash_password VARCHAR(120) NOT NULL
);


INSERT INTO "user" (email, hash_password) VALUES ('test@gmail.com', 'password');