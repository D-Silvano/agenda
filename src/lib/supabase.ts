import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://pfqiqafuyktxcjbatyay.supabase.co';
export const supabaseKey = 'sb_publishable_2WzW3Lya1HvEA3AHhHJynA_QXprSy7v';

export const supabase = createClient(supabaseUrl, supabaseKey);
