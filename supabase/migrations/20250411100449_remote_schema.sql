

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."redemption_option_enum" AS ENUM (
    'redeemable',
    'non-redeemable'
);


ALTER TYPE "public"."redemption_option_enum" OWNER TO "postgres";


CREATE TYPE "public"."user_role_enum" AS ENUM (
    'admin',
    'manager',
    'user'
);


ALTER TYPE "public"."user_role_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    first_name, 
    last_name, 
    email_address,
    avatar_url, 
    role, 
    phone_number
  ) 
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'email_address',
    NEW.raw_user_meta_data ->> 'avatar_url',
    COALESCE(
      (NEW.raw_user_meta_data ->> 'role')::user_role_enum, 
      'user'
    ),
    NEW.raw_user_meta_data ->> 'phone_number'
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_bookings_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_bookings_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_payments_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_payments_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_profiles_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_profiles_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."booking_code_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."booking_code_seq" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_code" "text" DEFAULT ('B-'::"text" || ("nextval"('"public"."booking_code_seq"'::"regclass"))::"text") NOT NULL,
    "user_id" "uuid" NOT NULL,
    "venue_id" "uuid" NOT NULL,
    "league" "text" NOT NULL,
    "home_team" "text" NOT NULL,
    "away_team" "text" NOT NULL,
    "home_team_logo" "text",
    "away_team_logo" "text",
    "event_date" "date" NOT NULL,
    "event_time" time without time zone NOT NULL,
    "event_datetime" timestamp without time zone GENERATED ALWAYS AS (("event_date" + "event_time")) STORED,
    "event_venue" "text",
    "status" "text" DEFAULT 'PENDING'::"text",
    "party_size" integer DEFAULT 1,
    "special_requests" "text",
    "payment_status" "text" DEFAULT 'PENDING'::"text",
    "amount" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'KES'::"text",
    "qr_code" "text",
    "check_in_status" "text" DEFAULT 'PENDING'::"text",
    "check_in_at" timestamp with time zone,
    "ticket_type" "text",
    "external_reference" "text",
    "notes" "text",
    "cancelled_at" timestamp with time zone,
    "cancelled_by" "uuid",
    "cancelled_reason" "text",
    "created_by" "uuid",
    "reminder_sent_at" timestamp with time zone,
    "promo_code" "text",
    "seat_allocation" "text"[],
    "device_type" "text" DEFAULT 'MOBILE'::"text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "bookings_amount_check" CHECK (("amount" >= (0)::numeric)),
    CONSTRAINT "bookings_party_size_check" CHECK (("party_size" > 0)),
    CONSTRAINT "event_datetime_check" CHECK (("event_datetime" > "now"()))
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."payment_code_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."payment_code_seq" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_id" "uuid" NOT NULL,
    "order_tracking_id" "text" NOT NULL,
    "payment_code" "text" DEFAULT ('P-'::"text" || ("nextval"('"public"."payment_code_seq"'::"regclass"))::"text") NOT NULL,
    "amount" numeric NOT NULL,
    "currency" "text" DEFAULT 'KES'::"text",
    "payment_method" "text" NOT NULL,
    "payment_status" "text" DEFAULT 'PENDING'::"text",
    "payment_date" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "transaction_reference" "text",
    "external_gateway" "text",
    "notes" "text",
    "refunded_date" timestamp with time zone,
    "refund_reason" "text",
    "refunded_by" "uuid",
    "refund_amount" numeric,
    "refund_status" "text",
    "refund_transaction_reference" "text",
    "refund_external_gateway" "text",
    "refund_notes" "text",
    "created_by" "uuid",
    "updated_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "payments_amount_check" CHECK (("amount" >= (0)::numeric)),
    CONSTRAINT "payments_refund_amount_check" CHECK (("refund_amount" >= (0)::numeric))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "first_name" "text",
    "last_name" "text",
    "email_address" "text",
    "avatar_url" "text",
    "website" "text",
    "preferred_team" "text",
    "phone_number" character varying(20),
    "date_of_birth" "date",
    "bio" "text",
    "role" "public"."user_role_enum" DEFAULT 'user'::"public"."user_role_enum",
    "address" "jsonb",
    "notification_prefs" "jsonb" DEFAULT '{"sms": false, "push": true, "email": true}'::"jsonb",
    "social_links" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "last_login" timestamp with time zone,
    "last_activity" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "search_vector" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", ((((((((((((((COALESCE("username", ''::"text") || ' '::"text") || COALESCE("first_name", ''::"text")) || ' '::"text") || COALESCE("last_name", ''::"text")) || ' '::"text") || COALESCE("bio", ''::"text")) || ' '::"text") || COALESCE("preferred_team", ''::"text")) || ' '::"text") || (COALESCE("phone_number", ''::character varying))::"text") || ' '::"text") || COALESCE(("address")::"text", ''::"text")) || ' '::"text") || COALESCE(("social_links")::"text", ''::"text")))) STORED
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "venue_id" "uuid" NOT NULL,
    "booking_id" "uuid",
    "rating" integer NOT NULL,
    "comment" "text",
    "is_public" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "rating_range" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."venue_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "venue_id" "uuid" NOT NULL,
    "asset_url" "jsonb" DEFAULT '[]'::"jsonb",
    "document_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."venue_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."venues" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "address" "text" NOT NULL,
    "description" "text",
    "longitude" double precision,
    "latitude" double precision,
    "amenities" "jsonb",
    "photos" "jsonb",
    "average_rating" numeric(3,2),
    "pricing" "text",
    "redemption_option" "public"."redemption_option_enum" DEFAULT 'redeemable'::"public"."redemption_option_enum",
    "capacity" integer,
    "contact_phone" "text",
    "contact_email" "text",
    "website_url" "text",
    "social_links" "jsonb",
    "manager_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone,
    "is_active" boolean DEFAULT false,
    "status" "text" DEFAULT 'draft'::"text",
    "search_vector" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"english"'::"regconfig", ((((((((((((((COALESCE("name", ''::"text") || ' '::"text") || COALESCE("description", ''::"text")) || ' '::"text") || COALESCE("address", ''::"text")) || ' '::"text") || COALESCE("website_url", ''::"text")) || ' '::"text") || COALESCE("contact_phone", ''::"text")) || ' '::"text") || COALESCE("contact_email", ''::"text")) || ' '::"text") || COALESCE("pricing", ''::"text")) || ' '::"text") || COALESCE(("amenities")::"text", ''::"text")))) STORED,
    CONSTRAINT "venues_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."venues" OWNER TO "postgres";


ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_booking_code_key" UNIQUE ("booking_code");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "one_review_per_booking" UNIQUE ("user_id", "booking_id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_order_tracking_id_key" UNIQUE ("order_tracking_id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_payment_code_key" UNIQUE ("payment_code");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_refund_transaction_reference_key" UNIQUE ("refund_transaction_reference");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_transaction_reference_key" UNIQUE ("transaction_reference");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_address_key" UNIQUE ("email_address");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_phone_number_key" UNIQUE ("phone_number");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."venue_documents"
    ADD CONSTRAINT "venue_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."venues"
    ADD CONSTRAINT "venues_pkey" PRIMARY KEY ("id");



CREATE INDEX "bookings_event_datetime_idx" ON "public"."bookings" USING "btree" ("event_datetime");



CREATE INDEX "bookings_status_idx" ON "public"."bookings" USING "btree" ("status");



CREATE INDEX "bookings_user_id_idx" ON "public"."bookings" USING "btree" ("user_id");



CREATE INDEX "bookings_venue_id_idx" ON "public"."bookings" USING "btree" ("venue_id");



CREATE INDEX "payments_booking_id_idx" ON "public"."payments" USING "btree" ("booking_id");



CREATE INDEX "payments_created_at_idx" ON "public"."payments" USING "btree" ("created_at");



CREATE INDEX "payments_status_idx" ON "public"."payments" USING "btree" ("payment_status");



CREATE INDEX "profiles_created_at_idx" ON "public"."profiles" USING "btree" ("created_at");



CREATE INDEX "profiles_first_name_idx" ON "public"."profiles" USING "btree" ("lower"("first_name"));



CREATE INDEX "profiles_is_active_idx" ON "public"."profiles" USING "btree" ("is_active");



CREATE INDEX "profiles_last_name_idx" ON "public"."profiles" USING "btree" ("lower"("last_name"));



CREATE INDEX "profiles_role_idx" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "profiles_search_vector_idx" ON "public"."profiles" USING "gin" ("search_vector");



CREATE INDEX "profiles_username_idx" ON "public"."profiles" USING "btree" ("lower"("username"));



CREATE INDEX "venue_documents_created_at_idx" ON "public"."venue_documents" USING "btree" ("created_at");



CREATE INDEX "venue_documents_type_idx" ON "public"."venue_documents" USING "btree" ("document_type");



CREATE INDEX "venue_documents_venue_id_idx" ON "public"."venue_documents" USING "btree" ("venue_id");



CREATE INDEX "venues_created_at_idx" ON "public"."venues" USING "btree" ("created_at");



CREATE INDEX "venues_manager_id_idx" ON "public"."venues" USING "btree" ("manager_id");



CREATE INDEX "venues_search_vector_idx" ON "public"."venues" USING "gin" ("search_vector");



CREATE INDEX "venues_status_idx" ON "public"."venues" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "set_bookings_updated_at" BEFORE UPDATE ON "public"."bookings" FOR EACH ROW EXECUTE FUNCTION "public"."update_bookings_updated_at"();



CREATE OR REPLACE TRIGGER "set_payments_updated_at" BEFORE UPDATE ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."update_payments_updated_at"();



CREATE OR REPLACE TRIGGER "set_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_profiles_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."venues" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at_venue_documents" BEFORE UPDATE ON "public"."venue_documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_cancelled_by_fkey" FOREIGN KEY ("cancelled_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_refunded_by_fkey" FOREIGN KEY ("refunded_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."venue_documents"
    ADD CONSTRAINT "venue_documents_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."venues"
    ADD CONSTRAINT "venues_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can cancel any booking." ON "public"."bookings" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"public"."user_role_enum")))));



CREATE POLICY "Admins can delete any payment." ON "public"."payments" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"public"."user_role_enum")))));



CREATE POLICY "Admins can insert payments for anyone." ON "public"."payments" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"public"."user_role_enum")))));



CREATE POLICY "Admins can update any payment." ON "public"."payments" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"public"."user_role_enum"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"public"."user_role_enum")))));



CREATE POLICY "Admins can view all payments." ON "public"."payments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"public"."user_role_enum")))));



CREATE POLICY "Managers can cancel venue bookings." ON "public"."bookings" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."venues" "v"
  WHERE (("v"."id" = "bookings"."venue_id") AND ("v"."manager_id" = "auth"."uid"())))));



CREATE POLICY "Managers can create venues." ON "public"."venues" FOR INSERT WITH CHECK (("auth"."uid"() = "manager_id"));



CREATE POLICY "Managers can delete venues they own." ON "public"."venues" FOR DELETE USING (("auth"."uid"() = "manager_id"));



CREATE POLICY "Managers can update their own venues." ON "public"."venues" FOR UPDATE USING (("auth"."uid"() = "manager_id"));



CREATE POLICY "Managers can view payments for their venues' bookings." ON "public"."payments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."bookings"
     JOIN "public"."venues" "v" ON (("bookings"."venue_id" = "v"."id")))
  WHERE (("payments"."booking_id" = "bookings"."id") AND ("v"."manager_id" = "auth"."uid"())))));



CREATE POLICY "Public can view reviews." ON "public"."reviews" FOR SELECT USING (true);



CREATE POLICY "Users can cancel their own bookings." ON "public"."bookings" FOR DELETE USING ((("auth"."uid"() = "user_id") AND ("status" = 'pending'::"text")));



CREATE POLICY "Users can delete their own profile." ON "public"."profiles" FOR DELETE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can delete their own reviews." ON "public"."reviews" FOR DELETE USING ((("auth"."uid"() = "user_id") OR ("auth"."role"() = 'admin'::"text")));



CREATE POLICY "Users can insert payments for their own bookings." ON "public"."payments" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."bookings"
  WHERE (("bookings"."id" = "payments"."booking_id") AND ("bookings"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert reviews for their own bookings/venues." ON "public"."reviews" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") OR ("auth"."role"() = 'admin'::"text")));



CREATE POLICY "Users can insert their own bookings." ON "public"."bookings" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own pending payments." ON "public"."payments" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."bookings"
  WHERE (("bookings"."id" = "payments"."booking_id") AND ("bookings"."user_id" = "auth"."uid"()) AND ("payments"."payment_status" = 'pending'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."bookings"
  WHERE (("bookings"."id" = "payments"."booking_id") AND ("bookings"."user_id" = "auth"."uid"()) AND ("payments"."payment_status" = 'pending'::"text")))));



CREATE POLICY "Users can update their own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own reviews." ON "public"."reviews" FOR UPDATE USING ((("auth"."uid"() = "user_id") OR ("auth"."role"() = 'admin'::"text"))) WITH CHECK ((("auth"."uid"() = "user_id") OR ("auth"."role"() = 'admin'::"text")));



CREATE POLICY "Users can view payments for their own bookings." ON "public"."payments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."bookings"
  WHERE (("bookings"."id" = "payments"."booking_id") AND ("bookings"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own bookings." ON "public"."bookings" FOR SELECT USING (("auth"."uid"() = "user_id"));

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_bookings_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_bookings_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_bookings_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_payments_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_payments_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_payments_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_profiles_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_profiles_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_profiles_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

GRANT ALL ON SEQUENCE "public"."booking_code_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."booking_code_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."booking_code_seq" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."payment_code_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payment_code_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payment_code_seq" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."venue_documents" TO "anon";
GRANT ALL ON TABLE "public"."venue_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."venue_documents" TO "service_role";

GRANT ALL ON TABLE "public"."venues" TO "anon";
GRANT ALL ON TABLE "public"."venues" TO "authenticated";
GRANT ALL ON TABLE "public"."venues" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;