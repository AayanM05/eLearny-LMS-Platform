-- eLearny Phase 0: baseline migration.
-- Establishes the database exists and Flyway's own history table is created.
-- No domain tables yet (User/Course/etc. arrive in Phase 1's migration) —
-- this migration's only job is to prove the backend -> Postgres connection
-- and the Flyway pipeline both work end to end.

-- uuid_generate_v4() is not required since BaseEntity uses Hibernate's
-- GenerationType.UUID (application-generated), but pgcrypto is enabled here
-- since several V2 modules (audit logs, certificate verification codes)
-- will want gen_random_uuid() at the database level.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
