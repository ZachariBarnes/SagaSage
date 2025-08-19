--liquibase formatted plpgsql

--changeset Zachari.Barnes:13 labels:Add Delete characaterFunction context:delete-characters

--comment: "Adding function for deleting characters from table 02-18-24"
create or replace
function public.delete_character( __CharacterID BIGINT)
	returns setof public."characters" 
	language plpgsql
as '
	begin
		update
			sagasage.public."usage"
		set
			character_id = null
		where
			character_id = (__CharacterID) ;

		RETURN QUERY 
			delete
			from
				sagasage.public."characters"
			where
				id = __CharacterID returning *;
	end;

';
--rollback DROP FUNCTION public.delete_character;

