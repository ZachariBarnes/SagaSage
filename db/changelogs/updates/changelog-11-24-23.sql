--liquibase formatted sql

--changeset Zachari.Barnes:11 labels:update-characters context:update-characters
--comment: "Adding Unique key for upserts of characters into table 11-24-23"
ALTER TABLE public.characters ADD CONSTRAINT generation_id_uk UNIQUE (generation_id);
--rollback ALTER TABLE public.sessions DROP CONSTRAINT generation_id_uk;
