import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VisitRequest {
  page_path: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request body
    const { page_path } = await req.json() as VisitRequest;

    // Get IP address and user agent
    const ip_address = req.headers.get('x-forwarded-for') || 'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';

    console.log(`Recording visit for ${page_path} from ${ip_address}`);

    // Record the visit
    const { error: insertError } = await supabase
      .from('page_visits')
      .insert({
        page_path,
        ip_address,
        user_agent,
      });

    if (insertError) {
      console.error('Error inserting visit:', insertError);
      throw insertError;
    }

    // Get total visit count
    const { count, error: countError } = await supabase
      .from('page_visits')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting visits:', countError);
      throw countError;
    }

    console.log(`Total visits: ${count}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        total_visits: count 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in track-visit function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
