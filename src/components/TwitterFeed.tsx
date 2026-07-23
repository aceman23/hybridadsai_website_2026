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
      aria-label={`Tweet by ${user.name}: ${tweet.text.slice(0, 80)}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <img
            src={user.profile_image_url}
            alt=""
            className="w-9 h-9 rounded-full object-cover"
            width="36"
            height="36"
            loading="lazy"
            decoding="async"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate leading-tight">{user.name}</div>
            <div className="text-xs text-gray-600 truncate">@{user.username}</div>
          </div>
        </div>
        <XIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-colors flex-shrink-0" />
      </div>

      <p className="text-sm text-gray-700 leading-relaxed flex-grow line-clamp-5 mb-4">
        {tweet.text}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1" aria-label={`${tweet.public_metrics.like_count} likes`}>
            <Heart className="w-3.5 h-3.5" aria-hidden="true" />
            {formatCount(tweet.public_metrics.like_count)}
          </span>
          <span className="flex items-center gap-1" aria-label={`${tweet.public_metrics.retweet_count} reposts`}>
            <Repeat2 className="w-3.5 h-3.5" aria-hidden="true" />
            {formatCount(tweet.public_metrics.retweet_count)}
          </span>
          <span className="flex items-center gap-1" aria-label={`${tweet.public_metrics.reply_count} replies`}>
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
            {formatCount(tweet.public_metrics.reply_count)}
          </span>
        </div>
        <span className="text-xs text-gray-600">
          {formatRelativeTime(tweet.created_at)}
        </span>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-2xl p-5 shadow-sm min-w-[280px] max-w-[320px] flex-shrink-0 animate-pulse" aria-hidden="true">
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
            alt=""
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
            width="32"
            height="32"
            loading="lazy"
            decoding="async"
          />
          <div>
            <span className="font-semibold text-gray-900 text-sm">{feed.user.name}</span>
            <span className="text-gray-600 text-sm ml-1.5">@{feed.user.username}</span>
          </div>
        </div>
        <a
          href={`https://x.com/${feed.user.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={`Follow ${feed.user.name} on X`}
        >
          Follow
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
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

    if (!supabaseUrl || !supabaseKey) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`${supabaseUrl}/functions/v1/fetch-tweets?usernames=hybridadsai,antona23`, {
      headers: { Authorization: `Bearer ${supabaseKey}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
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

  const accounts = [
    { name: 'Hybrid Ads AI', username: 'hybridadsai', description: 'AI systems, digital advertising, and growth strategies.' },
    { name: 'Anton Ansalmar', username: 'antona23', description: 'AI engineering, agentic systems, and full-stack builds.' },
  ];

  if (error) {
    return (
      <section className="py-16 bg-gray-50 border-t border-gray-100" aria-label="Social media links">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 mb-10">
            <XIcon className="w-5 h-5 text-gray-900" />
            <h2 className="text-xl font-bold text-gray-900">Follow Us on X</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            {accounts.map((account) => (
              <a
                key={account.username}
                href={`https://x.com/${account.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200"
                aria-label={`Follow ${account.name} on X`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <XIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{account.name}</div>
                      <div className="text-xs text-gray-600">@{account.username}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" aria-hidden="true" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{account.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full w-fit transition-colors">
                  Follow on X
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100" aria-label="Latest posts on X">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 mb-10">
          <XIcon className="w-5 h-5 text-gray-900" />
          <h2 className="text-xl font-bold text-gray-900">Latest on X</h2>
        </div>

        {loading ? (
          <div className="space-y-10" aria-label="Loading tweets">
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
