import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
}

interface UserData {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
}

async function fetchUserTweets(username: string, bearerToken: string) {
  const userRes = await fetch(
    `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url,name,username`,
    { headers: { Authorization: `Bearer ${bearerToken}` } }
  );
  const userData = await userRes.json();

  if (!userData.data) return null;

  const user = userData.data as UserData;

  const tweetsRes = await fetch(
    `https://api.twitter.com/2/users/${user.id}/tweets?max_results=5&tweet.fields=created_at,public_metrics&exclude=retweets,replies`,
    { headers: { Authorization: `Bearer ${bearerToken}` } }
  );
  const tweetsData = await tweetsRes.json();

  return {
    user,
    tweets: (tweetsData.data || []) as Tweet[],
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const usernamesParam = url.searchParams.get("usernames");

    if (!usernamesParam) {
      return new Response(JSON.stringify({ error: "usernames parameter is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bearerToken = Deno.env.get("TWITTER_BEARER_TOKEN");
    if (!bearerToken) {
      return new Response(JSON.stringify({ error: "Twitter API not configured" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const usernames = usernamesParam.split(",").map((u) => u.trim()).filter(Boolean);
    const results = await Promise.all(
      usernames.map((username) => fetchUserTweets(username, bearerToken))
    );

    return new Response(JSON.stringify({ feeds: results.filter(Boolean) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
