-- Keep existing profile IDs and listing ownership; permit each business category.
alter table public.provider_profiles drop constraint provider_profiles_user_id_key;
alter table public.provider_profiles add constraint provider_profiles_user_type_key unique (user_id, provider_type);
notify pgrst, 'reload schema';
