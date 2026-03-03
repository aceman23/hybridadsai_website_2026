import { useState, useEffect } from 'react';
import { Heart, Repeat2, MessageCircle, ExternalLink } from 'lucide-react';

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

interface UserFeed {
  user: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
  };
  tweets: Tweet[];
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function TweetCard({ tweet, user }: { tweet: Tweet; user: UserFeed['user'] }) {
  const tweetUrl = `https://x.com/${user.username}/status/${tweet.id}`;

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 min-w-[280px] max-w-[320px] flex-shrink-0"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <img
            src={user.profile_image_url}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate leading-tight">{user.name}</div>
            <div className="text-xs text-gray-400 truncate">@{user.username}</div>
          </div>
        </div>
        <XIcon className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
      </div>

      <p className="text-sm text-gray-700 leading-relaxed flex-grow line-clamp-5 mb-4">
        {tweet.text}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {formatCount(tweet.public_metrics.like_count)}
          </span>
          <span className="flex items-center gap-1">
            <Repeat2 className="w-3.5 h-3.5" />
            {formatCount(tweet.public_metrics.retweet_count)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {formatCount(tweet.public_metrics.reply_count)}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {formatRelativeTime(tweet.created_at)}
        </span>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-2xl p-5 shadow-sm min-w-[280px] max-w-[320px] flex-shrink-0 animate-pulse">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-gray-100" />
        <div className="flex-1">
          <div className="h-3 bg-gray-100 rounded w-24 mb-1.5" />
          <div className="h-2.5 bg-gray-100 rounded w-16" />
        </div>
      </div>
      <div className="space-y-2 flex-grow mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <div className="h-2.5 bg-gray-100 rounded w-32 mt-auto pt-3 border-t border-gray-50" />
    </div>
  );
}

function FeedRow({ feed }: { feed: UserFeed }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={feed.user.profile_image_url}
            alt={feed.user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div>
            <span className="font-semibold text-gray-900 text-sm">{feed.user.name}</span>
            <span className="text-gray-400 text-sm ml-1.5">@{feed.user.username}</span>
          </div>
        </div>
        <a
          href={`https://x.com/${feed.user.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Follow
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {feed.tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} user={feed.user} />
        ))}
      </div>
    </div>
  );
}

export default function TwitterFeed() {
  const [feeds, setFeeds] = useState<UserFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    fetch(`${supabaseUrl}/functions/v1/fetch-tweets?usernames=hybridadsai,antona23`, {
      headers: { Authorization: `Bearer ${supabaseKey}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.feeds && data.feeds.length > 0) {
          setFeeds(data.feeds);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (error) return null;

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 mb-10">
          <XIcon className="w-5 h-5 text-gray-900" />
          <h2 className="text-xl font-bold text-gray-900">Latest on X</h2>
        </div>

        {loading ? (
          <div className="space-y-10">
            {[0, 1].map((row) => (
              <div key={row}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {feeds.map((feed) => (
              <FeedRow key={feed.user.username} feed={feed} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
