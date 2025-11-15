import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get IP address from request headers
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    const { sessionId, totalComparisons, correctAnswers, accuracy, comparisons } = await req.json();

    console.log('Recording session:', { sessionId, totalComparisons, correctAnswers, accuracy, ipAddress });

    // Insert session summary
    const { error: sessionError } = await supabaseClient
      .from('test_sessions')
      .insert({
        session_id: sessionId,
        total_comparisons: totalComparisons,
        correct_answers: correctAnswers,
        accuracy: accuracy,
        ip_address: ipAddress,
      });

    if (sessionError) {
      console.error('Error inserting session:', sessionError);
      throw sessionError;
    }

    // Insert individual comparisons
    const comparisonRecords = comparisons.map((comp: any, index: number) => ({
      session_id: sessionId,
      trial_number: index + 1,
      winner_name: comp.winnerName,
      winner_sugar: comp.winnerSugar,
      loser_name: comp.loserName,
      loser_sugar: comp.loserSugar,
      is_correct: comp.isCorrect,
      timestamp: comp.timestamp,
    }));

    const { error: comparisonsError } = await supabaseClient
      .from('test_comparisons')
      .insert(comparisonRecords);

    if (comparisonsError) {
      console.error('Error inserting comparisons:', comparisonsError);
      throw comparisonsError;
    }

    console.log('Successfully recorded session and comparisons');

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in record-session function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
