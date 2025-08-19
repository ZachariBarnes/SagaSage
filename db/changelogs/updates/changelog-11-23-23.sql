--liquibase formatted sql

--changeset Zachari.Barnes:10 labels:update-characters context:update-characters
--comment: "Updating data types of characters columns table 11-23-23"
ALTER TABLE public.characters ALTER COLUMN quirks TYPE jsonb USING quirks::jsonb;
--rollback ALTER TABLE public.characters ALTER COLUMN quirks TYPE text;
ALTER TABLE public.characters ALTER COLUMN goals TYPE jsonb USING goals::jsonb;
--rollback ALTER TABLE public.characters ALTER COLUMN goals TYPE text;
ALTER TABLE public.characters ALTER COLUMN appearance TYPE text;
--rollback ALTER TABLE public.characters ALTER COLUMN appearance TYPE jsonb USING appearance::jsonb;