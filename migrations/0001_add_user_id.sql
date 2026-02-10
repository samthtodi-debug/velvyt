DO $$ 
BEGIN 
  BEGIN
    ALTER TABLE "rsvps" ADD COLUMN "user_id" integer;
    ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column user_id already exists in rsvps.';
  END;
END $$;
