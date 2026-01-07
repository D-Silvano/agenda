import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pfqiqafuyktxcjbatyay.supabase.co';
const supabaseKey = 'sb_publishable_2WzW3Lya1HvEA3AHhHJynA_QXprSy7v';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLookup(cpf) {
    console.log(`Testing lookup for CPF: ${cpf}`);
    const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('cpf', cpf)
        .single();

    if (error) {
        console.error('Lookup failed:', error.message, error.code);
    } else {
        console.log('Lookup successful! Email found:', data.email);
    }
}

await testLookup('1234');
await testLookup('04723191321');
