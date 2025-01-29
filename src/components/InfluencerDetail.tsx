import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { influencers } from "../data/influencerData";
import { claims } from "../data/claimsData";

interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followerCount: number;
  trustScore: number;
  claimsCount: number;
  verifiedCount: number;
  specialization?: string;
  blog?: string;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "neutral" | "negative";
  color: string;
}

interface Claim {
  id: string;
  title: string;
  type: "Questionable" | "Verified";
  category: string;
  date: string;
  source: string;
  confidence: number;
  reference: string;
  blog: string;
  article: { title: string; date: string; source: string }[];
}

function generateStats(influencer: Influencer): Stat[] {
  const verifiedPercentage = Math.round(
    (influencer.verifiedCount / influencer.claimsCount) * 100
  );
  const unverifiedClaims = influencer.claimsCount - influencer.verifiedCount;
  const unverifiedPercentage = 100 - verifiedPercentage;

  return [
    {
      label: "Trust Score",
      value: `${influencer.trustScore}%`,
      change: "↑ 2.3%",
      changeType: "positive",
      color: "text-[#4E45E4]",
    },
    {
      label: "Total Claims",
      value: influencer.claimsCount.toString(),
      change: "Last 30 days",
      changeType: "neutral",
      color: "text-[#4E45E4]",
    },
    {
      label: "Verified Claims",
      value: influencer.verifiedCount.toString(),
      change: `${verifiedPercentage}% of total`,
      changeType: "positive",
      color: "text-green-500",
    },
    {
      label: "Questionable Claims",
      value: unverifiedClaims.toString(),
      change: `${unverifiedPercentage}% of total`,
      changeType: "neutral",
      color: "text-orange-500",
    },
  ];
}

export default function InfluencerDetail() {
  const { id } = useParams<{ id: string }>();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);

  useEffect(() => {
    if (id) {
      const foundInfluencer = influencers.find(
        (inf: Influencer) => inf.id === id
      );
      if (foundInfluencer) {
        setInfluencer(foundInfluencer);
      }
    }
  }, [id]);

  if (!influencer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  const getFilteredClaims = (influencerId: string | undefined) => {
    if (!influencerId) return [];

    return claims
      .filter((claim) => claim.id === influencerId)
      .sort((a, b) => {
        return b.blog.length - a.blog.length;
      });
  };

  const stats = generateStats(influencer);

  return (
    <div className="min-h-screen bg-gray-50 -m-8">
      <div className="bg-[#4E45E4] p-6">
        <div className="mx-auto">
          <Link
            to="/influencers"
            className="flex items-center text-white mb-6 hover:opacity-80"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Influencers
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={influencer.avatar}
                alt={influencer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div className="ml-4 text-white">
                <h1 className="text-2xl font-bold">{influencer.name}</h1>
                <p className="text-blue-100 mb-1">{influencer.handle}</p>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-100 mr-1" />
                  <span className="text-blue-100">
                    {(influencer.followerCount / 1000).toFixed(0)}k followers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-4xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span
                    className={`text-sm ${
                      stat.changeType === "positive"
                        ? "text-green-500"
                        : stat.changeType === "negative"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto">
          {getFilteredClaims(id).map((claim) => {
            const typedClaim: Claim = {
              ...claim,
              type: claim.type as "Questionable" | "Verified",
            };
            return (
              <div
                key={typedClaim.id}
                className="relative bg-white rounded-[2rem] shadow-2xl mb-12 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r "></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100 via-purple-100 to-pink-50 rounded-full blur-3xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-500"></div>

                <div className="p-8 sm:p-10">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <div className="flex flex-wrap items-center gap-4">
                      <span
                        className={`
                  relative overflow-hidden px-6 py-2 rounded-full text-sm font-semibold
                  ${
                    typedClaim.type === "Verified"
                      ? "text-[#22C55E] bg-emerald-100/80 ring-1 ring-emerald-400/30"
                      : "text-amber-900 bg-amber-100/80 ring-1 ring-amber-400/30"
                  }
                  before:absolute before:inset-0 before:bg-gradient-to-r 
                  ${
                    typedClaim.type === "Verified"
                      ? "before:from-emerald-500/10 before:to-teal-500/10"
                      : "before:from-amber-500/10 before:to-orange-500/10"
                  }
                  before:opacity-0 before:hover:opacity-100 before:transition-opacity
                `}
                      >
                        <span className="relative z-10">
                          {typedClaim.type.toLowerCase()}
                        </span>
                      </span>
                      <time className="text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-full">
                        {typedClaim.date}
                      </time>
                    </div>

                    <div className="relative group/score">
                      <div
                        className={`
                flex items-center gap-3 px-6 py-3 rounded-xl
                ${
                  typedClaim.confidence >= 90
                    ? "bg-gradient-to-br from-emerald-50 to-teal-50"
                    : "bg-gradient-to-br from-amber-50 to-orange-50"
                }
              `}
                      >
                        <span
                          className={`
                  text-2xl font-bold
                  ${
                    typedClaim.confidence >= 90
                      ? "text-[#22C55E]"
                      : "text-[#F97316]"
                  }
                `}
                        >
                          {typedClaim.confidence}%
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-600">
                            Trust Score
                          </span>
                          <span className="text-xs text-gray-400">
                            Confidence Level
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Title Section */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
                    {typedClaim.title}
                  </h2>

                  <div className="space-y-10">
                    {/* AI Analysis */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-100/50 via-fuchsia-100/50 to-pink-100/50 rounded-2xl blur"></div>
                      <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100/50">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 bg-gradient-to-br from-[#4E45E4] to-fuchsia-500 rounded-xl text-white shadow-lg">
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              AI Analysis
                            </h3>
                            <p className="text-gray-500">
                              Advanced content verification
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">
                          {typedClaim.blog}
                        </p>
                        <a
                          href="#"
                          className="inline-flex items-center text-[#4E45E4] hover:text-violet-700 font-semibold group/research"
                        >
                          View Detailed Research
                          <span className="ml-2 transform group-hover/research:translate-x-1 transition-transform duration-300">
                            →
                          </span>
                        </a>
                      </div>
                    </div>
                    {/* Recent Articles */}
                    {typedClaim.article && typedClaim.article.length > 0 && (
                      <div className="pt-6">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-2xl font-bold text-gray-900">
                            Recent Publications
                          </h3>
                          <span className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium">
                            {typedClaim.article.length} articles
                          </span>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                          {typedClaim.article.map((article, index) => (
                            <div
                              key={index}
                              className="group/card relative bg-white rounded-2xl p-6 transition-all duration-300
                        hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)]
                        before:absolute before:inset-0 before:bg-gradient-to-br before:from-violet-50 before:to-fuchsia-50
                        before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-300
                        hover:before:opacity-100 border border-gray-100"
                            >
                              <div className="relative">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 group-hover/card:text-[#4E45E4] transition-colors duration-300">
                                  {article.title}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <time className="text-sm text-gray-500 font-medium">
                                    {article.date}
                                  </time>
                                  <span className="text-sm font-semibold text-text-[#4E45E4] bg-violet-50 px-3 py-1 rounded-full">
                                    {article.source}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
