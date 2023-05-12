CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(80) UNIQUE NOT NULL,
    username VARCHAR(255) DEFAULT 'anonymous' NOT NULL,
    hash_password VARCHAR(120) NOT NULL,
    storage_count INTEGER DEFAULT 0 CHECK (storage_count >= 0 AND storage_count <=  3221225472),
    upload_count INTEGER DEFAULT 0
);

CREATE TYPE dataset_status AS ENUM ('created', 'pending', 'anonymizing', 'completed', 'idle', 'deleted','failed' );

CREATE TABLE "topic" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO topic (name) VALUES ('Education');
INSERT INTO topic (name) VALUES ('Entertainment');
INSERT INTO topic (name) VALUES ('Medical');
INSERT INTO topic (name) VALUES ('Science');
INSERT INTO topic (name) VALUES ('Social');


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
    topic INTEGER REFERENCES "topic" (id),
    file_size INTEGER NOT NULL,
    download_count INTEGER DEFAULT 0
); 


CREATE TABLE "dataset_status_history" (
    id SERIAL PRIMARY KEY,
    did VARCHAR(50) NOT NULL,
    status dataset_status NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE dataset_topic (
    did VARCHAR(50) REFERENCES "dataset" (did),
    tid SMALLINT REFERENCES "topic" (id),
    PRIMARY KEY (did, tid)
);


