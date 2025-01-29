import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { influencers as influencerData } from "../data/influencerData";
import { Influencer } from "../types/types";
import { LucideIcon } from "lucide-react";

import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Users,
} from "lucide-react";

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: "positive" | "negative";
}

function updateDashboardStats(influencers: Influencer[]): Stat[] {
  const totalClaims = influencers.reduce(
    (sum, inf) => sum + inf.claimsCount,
    0
  );
  const verifiedClaims = influencers.reduce(
    (sum, inf) => sum + inf.verifiedCount,
    0
  );
  const averageTrustScore =
    influencers.reduce((sum, inf) => sum + inf.trustScore, 0) /
    influencers.length;
  const claimsRequiringReview = totalClaims - verifiedClaims;

  return [
    {
      label: "Total Claims Analyzed",
      value: totalClaims.toLocaleString(),
      icon: BarChart3,
      change: "+12.3%",
      changeType: "positive",
    },
    {
      label: "Average Trust Score",
      value: `${averageTrustScore.toFixed(1)}%`,
      icon: TrendingUp,
      change: "+4.2%",
      changeType: "positive",
    },
    {
      label: "Claims Requiring Review",
      value: claimsRequiringReview.toLocaleString(),
      icon: AlertTriangle,
      change: "-2.1%",
      changeType: "negative",
    },
    {
      label: "Verified Claims",
      value: verifiedClaims.toLocaleString(),
      icon: CheckCircle,
      change: "+8.1%",
      changeType: "positive",
    },
  ];
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setInfluencers(influencerData);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (influencers.length > 0) {
      const updatedStats = updateDashboardStats(influencers);
      setStats(updatedStats);
    }
  }, [influencers]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Monitor and analyze health claims across platforms
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {!isLoading && influencers && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {influencers.map((influencer) => (
              <Link
                key={influencer.id}
                to={`/influencer/${influencer.id}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      src={influencer.avatar}
                      alt={influencer.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 flex items-center">
                        {influencer.name}
                        <ArrowUpRight className="h-5 w-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-gray-500">
                        {influencer.handle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Trust Score</div>
                      <div className="flex items-center">
                        <div
                          className={`text-lg font-semibold ${
                            influencer.trustScore >= 90
                              ? "text-green-600"
                              : influencer.trustScore >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {influencer.trustScore}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Followers</div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-1" />
                        <span className="text-lg font-semibold text-gray-900">
                          {(influencer.followerCount / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Claims: </span>
                        <span className="font-medium text-gray-900">
                          {influencer.claimsCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Verified: </span>
                        <span className="font-medium text-green-600">
                          {influencer.verifiedCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
