--liquibase formatted sql

--changeset Zachari.Barnes:8 labels:update-characters context:update-characters
--comment: "Updating the characters table 11-21-23"

ALTER TABLE public.characters ADD COLUMN generation_id BIGINT NOT NULL DEFAULT 0;
--rollback ALTER TABLE public.characters DROP COLUMN generation_id;

--changeset Zachari.Barnes:9 labels:update-characters context:update-characters
--comment: "Updating the characters table 11-1-23"
ALTER TABLE public.characters ADD CONSTRAINT generation_id_fk FOREIGN KEY (generation_id) REFERENCES public.usage (id)
--rollback ALTER TABLE public.sessions DROP CONSTRAINT generation_id_fk;
