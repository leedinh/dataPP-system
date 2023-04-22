CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(80) UNIQUE NOT NULL,
    username VARCHAR(255) DEFAULT 'anonymous' NOT NULL,
    hash_password VARCHAR(120) NOT NULL
);

CREATE TYPE dataset_status AS ENUM ('pending', 'anonymizing', 'completed', 'idle');

CREATE TABLE "dataset" (
    did VARCHAR(50) PRIMARY KEY,
    uid UUID NOT NULL REFERENCES "user" (id),
    filename VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    title VARCHAR(255),
    description VARCHAR(255),
    is_anonymized BOOLEAN,
    status dataset_status DEFAULT 'idle' NOT NULL,
    topic VARCHAR(100)
); 
