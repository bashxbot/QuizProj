import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, Medal, Award } from "lucide-react";
import type { LeaderboardEntry } from "@shared/schema";

export default function Leaderboard() {
  const { user } = useAuth();
  
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  const topThree = leaderboard?.slice(0, 3) || [];
  const restOfLeaderboard = leaderboard?.slice(3) || [];
  const userEntry = leaderboard?.find(entry => entry.username === user?.username);

  return (
    <div className="space-y-8 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-40 h-40 rounded-full bg-yellow-500/3 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-primary/3 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-accent/2 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="mb-8 relative z-10">
        <h1 className="text-4xl font-bold gradient-text mb-4 animate-gradient-x">🏆 Leaderboard</h1>
        <p className="text-muted-foreground text-lg">See how you stack up against other quiz masters</p>
        <div className="mt-4 h-1 w-32 bg-gradient-to-r from-yellow-500 via-primary to-accent rounded-full pulse-glow"></div>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <Card className="glass-morphism border-0 shadow-2xl relative z-10 enhanced-glow">
          <CardContent className="p-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-primary/5"></div>
            <div className="flex justify-center items-end space-x-12 relative z-10">
              {/* 2nd Place */}
              <div className="text-center group" data-testid="podium-second">
                <div className="bg-gradient-to-br from-gray-400/30 to-gray-500/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-400/40 shadow-lg shadow-gray-400/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-black text-gray-300">
                    {topThree[1]?.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{topThree[1]?.username}</h3>
                <p className="text-base text-muted-foreground font-semibold mb-4">{topThree[1]?.totalScore.toLocaleString()} pts</p>
                <div className="bg-gradient-to-t from-gray-500 to-gray-400 w-24 h-20 rounded-t-2xl mt-2 flex items-center justify-center shadow-xl shadow-gray-400/30 group-hover:shadow-gray-400/50 transition-shadow duration-300">
                  <span className="text-white font-black text-2xl sparkle">🥈</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center group" data-testid="podium-first">
                <div className="bg-gradient-to-br from-yellow-400/40 to-yellow-500/40 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-yellow-400/50 shadow-2xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300 pulse-glow">
                  <span className="text-2xl font-black text-yellow-200">
                    {topThree[0]?.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-xl mb-2">{topThree[0]?.username}</h3>
                <p className="text-lg text-muted-foreground font-semibold mb-4">{topThree[0]?.totalScore.toLocaleString()} pts</p>
                <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 w-24 h-28 rounded-t-2xl mt-2 flex items-center justify-center shadow-2xl shadow-yellow-400/40 group-hover:shadow-yellow-400/60 transition-shadow duration-300 enhanced-glow">
                  <span className="text-white font-black text-3xl sparkle">🏆</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center group" data-testid="podium-third">
                <div className="bg-gradient-to-br from-orange-400/30 to-orange-500/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-orange-400/40 shadow-lg shadow-orange-400/20 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-black text-orange-300">
                    {topThree[2]?.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{topThree[2]?.username}</h3>
                <p className="text-base text-muted-foreground font-semibold mb-4">{topThree[2]?.totalScore.toLocaleString()} pts</p>
                <div className="bg-gradient-to-t from-orange-500 to-orange-400 w-24 h-16 rounded-t-2xl mt-2 flex items-center justify-center shadow-xl shadow-orange-400/30 group-hover:shadow-orange-400/50 transition-shadow duration-300">
                  <span className="text-white font-black text-2xl sparkle">🥉</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Leaderboard */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Quizzes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Avg %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {leaderboard?.map((player) => {
                  const isCurrentUser = player.username === user?.username;
                  return (
                    <tr
                      key={player.id}
                      className={`hover:bg-muted transition-colors ${
                        isCurrentUser ? "bg-primary/5" : ""
                      }`}
                      data-testid={`leaderboard-row-${player.rank}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold leaderboard-rank">
                            {player.rank}
                          </span>
                          {player.rank <= 3 && (
                            <div className="text-accent">
                              {player.rank === 1 && <Trophy className="h-4 w-4" />}
                              {player.rank === 2 && <Medal className="h-4 w-4" />}
                              {player.rank === 3 && <Award className="h-4 w-4" />}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-primary">
                              {player.username.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {player.username}
                            {isCurrentUser && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full ml-2">
                                You
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {player.totalScore.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {player.quizzesTaken}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {player.averageScore}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Position Highlight */}
      {userEntry && userEntry.rank > 10 && (
        <Card className="shadow-sm border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-primary">#{userEntry.rank}</span>
                <span className="font-medium text-foreground">Your Position</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {userEntry.totalScore.toLocaleString()} points
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
