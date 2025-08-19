--liquibase formatted sql

--changeset Zachari.Barnes:12 labels:update-characters context:update-characters

--comment: "Adding flag for marking characters as private characters into table 02-12-24"
ALTER TABLE public.characters ADD COLUMN is_private boolean NOT NULL DEFAULT false;
--rollback ALTER TABLE public.characters DROP COLUMN is_private;


