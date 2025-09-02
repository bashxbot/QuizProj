
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { 
  Trophy, Star, Target, TrendingUp, Clock, Award, Settings, Palette, 
  Volume2, Bell, Shield, User, Moon, Sun, Monitor, Sparkles, Zap,
  Crown, Medal, ChevronRight, Activity, Calendar, BarChart3,
  Eye, EyeOff, Save, RefreshCw, Gamepad2, Globe, Lock, Play, Rocket
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("system");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [autoSave, setAutoSave] = useState(true);
  const [particlesEnabled, setParticlesEnabled] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ["/api/profile"],
  }) as { data: any };

  const { data: quizHistory } = useQuery({
    queryKey: ["/api/quiz-history"],
  }) as { data: any[] };

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System theme
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (mediaQuery.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  const applySettings = () => {
    // Save settings to localStorage
    const settings = {
      theme,
      soundEnabled,
      notificationsEnabled,
      animationsEnabled,
      privacyMode,
      language,
      autoSave,
      particlesEnabled
    };
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setShowSettings(false);
    
    // Settings saved successfully
    console.log('Settings applied successfully');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
          {/* Loading skeleton with glassmorphism */}
          <div className="glass-morphism p-8 rounded-3xl border border-primary/20 backdrop-blur-xl">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full skeleton"></div>
              <div className="space-y-3">
                <div className="h-8 w-48 skeleton rounded-full"></div>
                <div className="h-4 w-32 skeleton rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-morphism p-6 rounded-2xl border border-primary/10 skeleton h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Trophy,
      label: "Total Score",
      value: profile.totalScore?.toLocaleString() || "0",
      color: "text-yellow-400",
      bgGradient: "from-yellow-500/20 to-amber-500/20",
      glowColor: "shadow-yellow-500/20",
      particles: true
    },
    {
      icon: Star,
      label: "Average Score",
      value: profile.averageScore ? `${profile.averageScore.toFixed(1)}%` : "0%",
      color: "text-blue-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      glowColor: "shadow-blue-500/20",
      particles: true
    },
    {
      icon: Target,
      label: "Quizzes Taken",
      value: profile.totalQuizzes?.toString() || "0",
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/20 to-green-500/20",
      glowColor: "shadow-emerald-500/20",
      particles: false
    },
    {
      icon: TrendingUp,
      label: "Best Score",
      value: profile.bestScore ? `${profile.bestScore}%` : "0%",
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      glowColor: "shadow-purple-500/20",
      particles: true
    },
    {
      icon: Clock,
      label: "Time Spent",
      value: profile.totalTimeSpent ? `${Math.round(profile.totalTimeSpent / 60)}h` : "0h",
      color: "text-orange-400",
      bgGradient: "from-orange-500/20 to-red-500/20",
      glowColor: "shadow-orange-500/20",
      particles: false
    },
    {
      icon: Award,
      label: "Achievements",
      value: profile.achievements?.length?.toString() || "0",
      color: "text-rose-400",
      bgGradient: "from-rose-500/20 to-pink-500/20",
      glowColor: "shadow-rose-500/20",
      particles: true
    },
  ];

  const recentQuizzes = Array.isArray(quizHistory) ? quizHistory.slice(0, 5) : [];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/30";
    if (score >= 80) return "text-blue-400 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30";
    if (score >= 70) return "text-yellow-400 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
    if (score >= 60) return "text-orange-400 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30";
    return "text-red-400 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30";
  };

  const getRankIcon = (score: number) => {
    if (score >= 95) return { icon: Crown, color: "text-yellow-400", gradient: "from-yellow-400 to-amber-400", glow: "shadow-yellow-400/50" };
    if (score >= 90) return { icon: Trophy, color: "text-yellow-400", gradient: "from-yellow-500 to-amber-500", glow: "shadow-yellow-500/40" };
    if (score >= 80) return { icon: Medal, color: "text-gray-300", gradient: "from-gray-300 to-gray-400", glow: "shadow-gray-300/40" };
    if (score >= 70) return { icon: Award, color: "text-amber-600", gradient: "from-amber-600 to-yellow-600", glow: "shadow-amber-600/40" };
    return { icon: Target, color: "text-blue-400", gradient: "from-blue-400 to-cyan-400", glow: "shadow-blue-400/40" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      {particlesEnabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 6}s`
              }}
            >
              <Sparkles className="h-3 w-3 text-primary rotate-45" />
            </div>
          ))}
          
          {/* Gradient orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-accent/8 to-primary/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 p-6">
        {/* Enhanced Profile Header */}
        <div className="glass-morphism p-8 rounded-3xl border border-primary/20 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                {/* Neon glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300">
                  <User className="h-12 w-12 text-white drop-shadow-lg" />
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center border-2 border-background">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
                  {profile.username}
                </h1>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 px-4 py-1 text-sm font-semibold">
                    <Crown className="w-4 h-4 mr-1" />
                    Quiz Master
                  </Badge>
                  <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1">
                    <Activity className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Settings Dialog Trigger */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="relative group overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 hover:border-primary/50 backdrop-blur-xl px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 neon-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Settings className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="relative z-10">Settings</span>
                  <Sparkles className="ml-2 h-4 w-4 animate-sparkle" />
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-morphism border-2 border-primary/30 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center">
                    <Settings className="mr-4 h-8 w-8 text-primary animate-spin" style={{ animationDuration: "3s" }} />
                    Advanced Settings & Preferences
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-8 p-2">
                  {/* Appearance Section */}
                  <div className="glass-morphism p-6 rounded-2xl border border-primary/10">
                    <h3 className="text-2xl font-bold mb-6 flex items-center text-foreground">
                      <Palette className="mr-3 h-6 w-6 text-primary" />
                      Appearance & Theme
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[
                        { id: "light", icon: Sun, label: "Light Mode", desc: "Clean and bright" },
                        { id: "dark", icon: Moon, label: "Dark Mode", desc: "Easy on the eyes" },
                        { id: "system", icon: Monitor, label: "Auto", desc: "Follows system" }
                      ].map((themeOption) => {
                        const Icon = themeOption.icon;
                        return (
                          <button
                            key={themeOption.id}
                            onClick={() => setTheme(themeOption.id)}
                            className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                              theme === themeOption.id 
                                ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50 shadow-lg shadow-primary/20' 
                                : 'glass-effect border-border/50 hover:border-primary/30'
                            }`}
                          >
                            <Icon className={`h-8 w-8 mx-auto mb-3 ${theme === themeOption.id ? 'text-primary' : 'text-muted-foreground'}`} />
                            <h4 className="font-semibold text-lg">{themeOption.label}</h4>
                            <p className="text-sm text-muted-foreground">{themeOption.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div className="glass-morphism p-6 rounded-2xl border border-primary/10">
                    <h3 className="text-2xl font-bold mb-6 flex items-center text-foreground">
                      <Zap className="mr-3 h-6 w-6 text-accent" />
                      Experience & Effects
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { 
                          icon: Volume2, 
                          label: "Sound Effects", 
                          desc: "Audio feedback for interactions",
                          checked: soundEnabled, 
                          onChange: setSoundEnabled 
                        },
                        { 
                          icon: Sparkles, 
                          label: "Animations", 
                          desc: "Smooth transitions and effects",
                          checked: animationsEnabled, 
                          onChange: setAnimationsEnabled 
                        },
                        { 
                          icon: Eye, 
                          label: "Particle Effects", 
                          desc: "Background animated particles",
                          checked: particlesEnabled, 
                          onChange: setParticlesEnabled 
                        },
                        { 
                          icon: Save, 
                          label: "Auto Save", 
                          desc: "Automatically save progress",
                          checked: autoSave, 
                          onChange: setAutoSave 
                        }
                      ].map((setting, i) => {
                        const Icon = setting.icon;
                        return (
                          <div key={i} className="glass-effect p-4 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground">{setting.label}</span>
                                  <p className="text-sm text-muted-foreground">{setting.desc}</p>
                                </div>
                              </div>
                              <Switch 
                                checked={setting.checked} 
                                onCheckedChange={setting.onChange}
                                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-accent"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Privacy & Security */}
                  <div className="glass-morphism p-6 rounded-2xl border border-primary/10">
                    <h3 className="text-2xl font-bold mb-6 flex items-center text-foreground">
                      <Shield className="mr-3 h-6 w-6 text-green-400" />
                      Privacy & Security
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { 
                          icon: Bell, 
                          label: "Push Notifications", 
                          desc: "Get notified about updates",
                          checked: notificationsEnabled, 
                          onChange: setNotificationsEnabled 
                        },
                        { 
                          icon: privacyMode ? EyeOff : Eye, 
                          label: "Privacy Mode", 
                          desc: "Hide personal information",
                          checked: privacyMode, 
                          onChange: setPrivacyMode 
                        }
                      ].map((setting, i) => {
                        const Icon = setting.icon;
                        return (
                          <div key={i} className="glass-effect p-4 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                                  <Icon className="h-5 w-5 text-green-400" />
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground">{setting.label}</span>
                                  <p className="text-sm text-muted-foreground">{setting.desc}</p>
                                </div>
                              </div>
                              <Switch 
                                checked={setting.checked} 
                                onCheckedChange={setting.onChange}
                                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-400 data-[state=checked]:to-emerald-400"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Language Selection */}
                    <div className="mt-6 glass-effect p-4 rounded-xl border border-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                            <Globe className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Language</span>
                            <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                          </div>
                        </div>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-40 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-morphism border border-primary/20">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="zh">中文</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Apply Settings Button */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(false)}
                      className="px-8 py-3 rounded-xl font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={applySettings}
                      className="relative group overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                      <div className="relative flex items-center">
                        <Save className="mr-2 h-5 w-5" />
                        Apply Settings
                        <Sparkles className="ml-2 h-4 w-4 animate-sparkle" />
                      </div>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`relative glass-morphism p-8 rounded-2xl border border-primary/20 backdrop-blur-xl transform transition-all duration-500 hover:scale-105 hover:rotate-1 ${stat.glowColor} hover:shadow-2xl`}>
                  {/* Neon border effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.bgGradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300`}></div>
                  
                  {/* Floating particles for certain stats */}
                  {stat.particles && particlesEnabled && (
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute animate-float opacity-30"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                          }}
                        >
                          <Sparkles className="h-2 w-2 text-primary" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm border border-primary/20`}>
                        <Icon className={`h-8 w-8 ${stat.color} drop-shadow-lg`} />
                      </div>
                      <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className={`text-4xl font-black ${stat.color} drop-shadow-lg`}>
                        {stat.value}
                      </p>
                      
                      {/* Progress indicator for certain stats */}
                      {(stat.label.includes("Score") || stat.label.includes("Time")) && (
                        <div className="w-full bg-muted/30 rounded-full h-2 mt-3 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${stat.bgGradient} rounded-full transition-all duration-1000 shadow-sm`}
                            style={{ width: `${Math.min(100, parseInt(stat.value) || 30)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Recent Activity */}
        <div className="glass-morphism p-8 rounded-3xl border border-primary/20 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center">
              <Activity className="mr-4 h-8 w-8 text-primary" />
              Recent Activity
            </h2>
            <Badge className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-primary/30 px-4 py-2 font-semibold">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 days
            </Badge>
          </div>
          
          <div className="space-y-6">
            {recentQuizzes.length > 0 ? (
              recentQuizzes.map((quiz: any, index: number) => {
                const rankIcon = getRankIcon(quiz.score);
                const RankIcon = rankIcon.icon;
                return (
                  <div 
                    key={quiz.id} 
                    className="group slide-in" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative glass-morphism p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl overflow-hidden">
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Rank glow effect */}
                      <div className={`absolute -top-2 -left-2 w-20 h-20 bg-gradient-to-br ${rankIcon.gradient} rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                      
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {/* Enhanced rank icon with glow */}
                          <div className="relative">
                            <div className={`absolute inset-0 bg-gradient-to-r ${rankIcon.gradient} rounded-2xl blur opacity-40`}></div>
                            <div className={`relative p-4 rounded-2xl bg-gradient-to-br from-background/50 to-card/50 backdrop-blur-sm border-2 border-primary/20 ${rankIcon.glow} shadow-lg`}>
                              <RankIcon className={`h-8 w-8 ${rankIcon.color} drop-shadow-lg`} />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                              {quiz.category}
                            </h3>
                            <div className="flex items-center space-x-4 text-muted-foreground">
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(quiz.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <BarChart3 className="w-4 h-4 mr-1" />
                                {quiz.questions?.length || 0} questions
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {/* Enhanced score badge */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur"></div>
                            <Badge className={`relative px-6 py-3 text-xl font-black border-2 rounded-2xl ${getScoreColor(quiz.score)} shadow-lg backdrop-blur-sm`}>
                              {quiz.score}%
                            </Badge>
                          </div>
                          
                          <Badge className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/30 px-4 py-2 rounded-xl font-semibold">
                            <Sparkles className="w-4 h-4 mr-1" />
                            +{quiz.pointsEarned}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
                  <div className="relative p-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 w-32 h-32 mx-auto flex items-center justify-center">
                    <Gamepad2 className="h-16 w-16 text-primary/60" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Ready for your first challenge?</h3>
                <p className="text-lg text-muted-foreground mb-6">Start your quiz journey and see your progress here!</p>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  <Trophy className="mr-2 h-5 w-5" />
                  Take Your First Quiz
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Showcase */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div className="glass-morphism p-8 rounded-3xl border border-primary/20 backdrop-blur-xl shadow-2xl">
            <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center mb-8">
              <Award className="mr-4 h-8 w-8 text-primary" />
              Achievements & Badges
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {profile.achievements.map((achievement: any, index: number) => (
                <div key={index} className="group slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="relative glass-morphism p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 text-center">
                      <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-foreground">{achievement.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
