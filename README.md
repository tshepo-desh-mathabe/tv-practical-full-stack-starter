
This repository contains frontend and back-end and steps on how to get the project running locally. Here are the steps.

## `1. Install Node`
Make sure you have `node.js` installed.
Might not be required, but have NestJS install by running `npm install -g @nestjs/cli` if you planning on adding new logic.

## `2. Run Docker Compose`
Make sure that docker-compose runs. One can run it locally by using `docker compose up -d` to get you all the necessary container required to run the project.

## `3. Database Setup`
The project uses `Postgres` and below are the default connection details. If you have `Postgres` running with different DB connection details, then skip this step and move to `3.1`
`
Host: localhost
Port: 5432
Database: fibertime
Username: root
Password: root
Driver: PostgreSQL
`

### 3.1 Postgres Already Running
So you have `Postgres` running and connection details are different, then stop all containers for this project with `docker compose down -v`.
Edit the docker file, essentially the below to match your current running connection details:
`
...
...
fibertime-db:
    ...
    ports:
    - "5432:5432"
    environment:
      - POSTGRES_USER=root
      - POSTGRES_PASSWORD=root
      ...
      ...
`

## 4. `Create Tables`
Run the below to have your tables created:
`
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  device_code VARCHAR(4) UNIQUE NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id)
);

-- Bundles table
CREATE TABLE bundles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  remaining_days INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OTPs table with rate limiting
CREATE TABLE otps (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(15) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_devices_code ON devices(device_code);
CREATE INDEX idx_devices_user ON devices(user_id);
CREATE INDEX idx_bundles_user ON bundles(user_id);
CREATE INDEX idx_otps_phone ON otps(phone_number);
`

## 5. Get fibertime_be running
npm i
npm start
swagger

## 6. Get fibertime_fe running
npm i
npm start
