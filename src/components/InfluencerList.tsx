import { useState, useEffect } from "react";
import { Search, Filter, Loader } from "lucide-react";
import { influencers as initialInfluencers } from "../data/influencerData";
import { Link } from "react-router-dom";
import { Users, CheckCircle, BarChart2 } from "lucide-react";
import CategoryFilter from "./CategoryFilter";

interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  trustScore: number;
  followerCount: number;
  claimsCount: number;
  verifiedCount: number;
  totalClaims: number;
  status: "Active" | "Inactive";
}

export default function InfluencerList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>(
    []
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minTrustScore: 0,
    minFollowers: 0,
    status: "all",
    category: "all",
  });
  const [stats, setStats] = useState({
    activeInfluencers: 0,
    claimsVerified: 0,
    averageTrustScore: 0,
  });

  useEffect(() => {
    const fetchInfluencers = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mappedInfluencers = initialInfluencers.map((inf) => ({
          ...inf,
          category: inf.category || "Healthcare",
          totalClaims: inf.claimsCount,
          status: "Active" as const,
        }));
        setInfluencers(mappedInfluencers);
        setFilteredInfluencers(mappedInfluencers);

        const activeInfluencers = mappedInfluencers.filter(
          (inf) => inf.status === "Active"
        ).length;
        const totalClaimsVerified = mappedInfluencers.reduce(
          (sum, inf) => sum + inf.verifiedCount,
          0
        );
        const avgTrustScore =
          mappedInfluencers.reduce((sum, inf) => sum + inf.trustScore, 0) /
          mappedInfluencers.length;

        setStats({
          activeInfluencers,
          claimsVerified: totalClaimsVerified,
          averageTrustScore: Number(avgTrustScore.toFixed(1)),
        });
      } catch (error) {
        console.error("Error fetching influencers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  useEffect(() => {
    const filtered = influencers.filter((influencer) => {
      const matchesSearch =
        influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        influencer.trustScore >= filters.minTrustScore &&
        influencer.followerCount >= filters.minFollowers &&
        (filters.status === "all" ||
          influencer.status.toLowerCase() === filters.status) &&
        (filters.category === "all" ||
          influencer.category.toLowerCase() === filters.category.toLowerCase());

      return matchesSearch && matchesFilters;
    });

    setFilteredInfluencers(filtered);
  }, [searchTerm, filters, influencers]);

  const handleCategoryChange = (e: { target: { value: string } }) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Influencers</h1>
          <p className="text-gray-600">
            Monitor and analyze health influencers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
          <div className="flex items-start justify-between">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-12 h-12 bg-emerald-100 rounded-lg group-hover:scale-110 transition-transform" />
              <Users className="w-8 h-8 text-emerald-500 relative z-10" />
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-4xl font-bold text-gray-800 mb-1 tracking-tight">
                {stats.activeInfluencers.toLocaleString()}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Active Influencers
                </span>
                <span className="text-emerald-500 text-xs">↑ 12%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
          <div className="flex items-start justify-between">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-12 h-12 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform" />
              <CheckCircle className="w-8 h-8 text-blue-500 relative z-10" />
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-4xl font-bold text-gray-800 mb-1 tracking-tight">
                {stats.claimsVerified.toLocaleString()}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Claims Verified
                </span>
                <span className="text-blue-500 text-xs">↑ 8%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 group">
          <div className="flex items-start justify-between">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-12 h-12 bg-violet-100 rounded-lg group-hover:scale-110 transition-transform" />
              <BarChart2 className="w-8 h-8 text-violet-500 relative z-10" />
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-4xl font-bold text-gray-800 mb-1 tracking-tight">
                {stats.averageTrustScore}%
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Average Trust Score
                </span>
                <span className="text-violet-500 text-xs">↑ 5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-8">
        <CategoryFilter
          filters={filters}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search influencers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Trust Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.minTrustScore}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minTrustScore: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Followers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minFollowers}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minFollowers: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="All">All</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Infectious Disease">
                      Infectious Disease
                    </option>
                    <option value="Public Health">Public Health</option>
                    <option value="Healthcare Policy">Healthcare Policy</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Digital Health">Digital Health</option>
                    <option value="Primary Care">Primary Care</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Preventive Medicine">
                      Preventive Medicine
                    </option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Alternative Medicine">
                      Alternative Medicine
                    </option>
                    <option value="Natural Medicine">Natural Medicine</option>
                    <option value="Women's Health">Women's Health</option>
                    <option value="Vaccines">Vaccines</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              {/* Desktop view */}
              <div className="hidden md:block">
                <table className="w-full text-white">
                  <thead className="bg-[#e0e2e2]">
                    <tr className="text-gray-900 border-b border-custom-gray text-xs uppercase">
                      <th className="px-6 py-5 text-left">Rank</th>
                      <th className="px-6 py-5 text-left">Influencer</th>
                      <th className="px-6 py-5 text-left">Category</th>
                      <th className="px-6 py-5 text-left">Trust Score</th>
                      <th className="px-6 py-5 text-left">Trend</th>
                      <th className="px-6 py-5 text-left">Followers</th>
                      <th className="px-6 py-5 text-left">Verified Claims</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredInfluencers.map((influencer, index) => (
                      <tr
                        key={influencer.id}
                        className="hover:bg-[#F9FAFB] transition-colors"
                      >
                        <Link
                          to={`/influencer/${influencer.id}`}
                          className="contents"
                        >
                          <td className="px-6 py-4">
                            <span className="text-gray-700">#{index + 1}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={influencer.avatar}
                                alt={influencer.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="text-gray-700">
                                  {influencer.name}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {influencer.handle}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-700">
                              {influencer.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={
                                influencer.trustScore >= 90
                                  ? "text-green-400"
                                  : influencer.trustScore >= 50
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }
                            >
                              {influencer.trustScore}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={
                                influencer.trustScore >= 90
                                  ? "text-green-400"
                                  : influencer.trustScore >= 50
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }
                            >
                              {influencer.trustScore >= 90
                                ? "↗"
                                : influencer.trustScore >= 50
                                ? "↳"
                                : "↓"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-700">
                              {(influencer.followerCount / 1000).toFixed(0)}K+
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-700">
                              {influencer.verifiedCount}
                            </span>
                          </td>
                        </Link>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view */}
              <div className="md:hidden">
                <div className="grid grid-cols-1 gap-4 p-4">
                  {filteredInfluencers.map((influencer, index) => (
                    <Link
                      to={`/influencer/${influencer.id}`}
                      key={influencer.id}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-gray-700">
                          #{index + 1}
                        </span>
                        <img
                          src={influencer.avatar}
                          alt={influencer.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {influencer.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {influencer.handle}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Trust Score</p>
                          <p
                            className={`text-lg font-semibold ${
                              influencer.trustScore >= 90
                                ? "text-green-500"
                                : influencer.trustScore >= 50
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {influencer.trustScore}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Followers</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {(influencer.followerCount / 1000).toFixed(0)}k
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
