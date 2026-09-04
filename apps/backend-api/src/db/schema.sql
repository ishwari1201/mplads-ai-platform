-- PostGIS and Spatial Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('MP_MLA', 'DISTRICT_AUTHORITY', 'IMPLEMENTING_AGENCY', 'NODAL_OFFICER', 'CITIZEN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('RECOMMENDED', 'IN_FEASIBILITY', 'SANCTIONED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'FROZEN_PENDING_AUDIT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE category_type AS ENUM ('SC', 'ST', 'GENERAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CITIZEN',
    constituency_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. MPs Table (Member of Parliament / Assembly)
CREATE TABLE IF NOT EXISTS mps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    party VARCHAR(100) NOT NULL,
    constituency_name VARCHAR(150) NOT NULL,
    total_allocation NUMERIC(15, 2) DEFAULT 50000000.00 NOT NULL, -- ₹5 Crore per annum
    sc_reserved_spent NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,     -- 15% statutory SC allocation
    st_reserved_spent NUMERIC(15, 2) DEFAULT 0.00 NOT NULL,     -- 7.5% statutory ST allocation
    general_spent NUMERIC(15, 2) DEFAULT 0.00 NOT NULL
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sector VARCHAR(100) NOT NULL,
    category category_type NOT NULL DEFAULT 'GENERAL',
    estimated_cost NUMERIC(15, 2) NOT NULL CHECK (estimated_cost > 0),
    sanctioned_amount NUMERIC(15, 2) CHECK (sanctioned_amount >= 0),
    status project_status NOT NULL DEFAULT 'RECOMMENDED',
    mp_id UUID NOT NULL REFERENCES mps(id) ON DELETE RESTRICT,
    da_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ia_id UUID REFERENCES users(id) ON DELETE SET NULL,
    location GEOMETRY(Point, 4326),
    address TEXT NOT NULL,
    sla_deadline TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '75 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Audit Logs Table (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_taken VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    previous_state JSONB,
    new_state JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Performance & Geospatial Indexing
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_projects_mp_id ON projects(mp_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_audit_logs_project ON audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Enforce Immutability on Audit Trail (Prevent UPDATE or DELETE on audit_logs)
CREATE OR REPLACE FUNCTION enforce_audit_immutability()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'TAMPER ERROR: Operation % is prohibited on immutable audit logs.', TG_OP;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_tampering ON audit_logs;
CREATE TRIGGER trg_prevent_audit_tampering
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION enforce_audit_immutability();
