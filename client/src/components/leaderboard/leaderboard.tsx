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
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">See how you stack up against other quiz masters</p>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <Card className="card">
          <CardContent className="p-8">
            <div className="flex justify-center items-end space-x-8">
              {/* 2nd Place */}
              <div className="text-center" data-testid="podium-second">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 border-2 border-gray-300">
                  <span className="text-lg font-bold text-gray-600">
                    {topThree[1]?.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{topThree[1]?.username}</h3>
                <p className="text-sm text-muted-foreground mb-3">{topThree[1]?.totalScore.toLocaleString()} pts</p>
                <div className="bg-gray-400 w-20 h-16 rounded-t-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center" data-testid="podium-first">
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3 border-2 border-yellow-400">
                  <span className="text-lg font-bold text-yellow-700">
                    {topThree[0]?.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{topThree[0]?.username}</h3>
                <p className="text-sm text-muted-foreground mb-3">{topThree[0]?.totalScore.toLocaleString()} pts</p>
                <div className="bg-yellow-500 w-20 h-20 rounded-t-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center" data-testid="podium-third">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3 border-2 border-orange-300">
                  <span className="text-lg font-bold text-orange-600">
                    {topThree[2]?.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{topThree[2]?.username}</h3>
                <p className="text-sm text-muted-foreground mb-3">{topThree[2]?.totalScore.toLocaleString()} pts</p>
                <div className="bg-orange-500 w-20 h-12 rounded-t-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Leaderboard */}
      <Card className="card">
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
                      className={`table-row ${
                        isCurrentUser ? "highlight" : ""
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
