
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Brain, Menu, LogOut, Settings, Sparkles, Moon, Sun, Monitor, Bell, Shield, Palette, Save, Eye, EyeOff, Zap, Crown, BarChart3, Play, Trophy, User } from "lucide-react";
import type { Section } from "@/pages/home-page";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function Navbar({ currentSection, onSectionChange }: NavbarProps) {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => 
    JSON.parse(localStorage.getItem('notifications') || 'true')
  );
  const [privacyMode, setPrivacyMode] = useState(() => 
    JSON.parse(localStorage.getItem('privacyMode') || 'false')
  );
  const [autoSave, setAutoSave] = useState(() => 
    JSON.parse(localStorage.getItem('autoSave') || 'true')
  );
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [soundEffects, setSoundEffects] = useState(() => 
    JSON.parse(localStorage.getItem('soundEffects') || 'true')
  );

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const applySettings = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('notifications', JSON.stringify(notificationsEnabled));
    localStorage.setItem('privacyMode', JSON.stringify(privacyMode));
    localStorage.setItem('autoSave', JSON.stringify(autoSave));
    localStorage.setItem('language', language);
    localStorage.setItem('soundEffects', JSON.stringify(soundEffects));
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    
    setShowSettings(false);
    toast({
      title: "Settings Applied",
      description: "Your preferences have been saved successfully!",
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const navItems = [
    { key: "dashboard" as const, label: "Dashboard", icon: BarChart3, gradient: "from-blue-500 to-cyan-500" },
    { key: "quiz" as const, label: "Take Quiz", icon: Play, gradient: "from-purple-500 to-pink-500" },
    { key: "leaderboard" as const, label: "Leaderboard", icon: Trophy, gradient: "from-yellow-500 to-orange-500" },
    { key: "profile" as const, label: "Profile", icon: User, gradient: "from-green-500 to-emerald-500" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar-container">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse-glow">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce">
                    <Crown className="h-3 w-3 text-white m-0.5" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black gradient-text">QuizMaster</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent -mt-1">Pro</span>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-3">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    className={`nav-item group ${
                      currentSection === item.key ? "active" : ""
                    }`}
                    onClick={() => onSectionChange(item.key)}
                    data-testid={`nav-${item.key}`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Settings Dialog */}
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative group glass-morphism border border-white/20 hover:border-primary/50 rounded-xl p-3"
                  >
                    <Settings className="h-5 w-5 text-white group-hover:rotate-180 transition-transform duration-500" />
                    <Sparkles className="ml-2 h-4 w-4 text-yellow-400 animate-sparkle" />
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto glass-morphism border-2 border-white/20 backdrop-blur-3xl rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-4xl font-black gradient-text flex items-center justify-center pb-6">
                      <Settings className="mr-4 h-10 w-10 text-primary animate-spin" style={{ animationDuration: "4s" }} />
                      Advanced Settings & Preferences
                      <Sparkles className="ml-4 h-8 w-8 text-yellow-400 animate-float" />
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-10 p-2">
                    {/* Appearance Section */}
                    <div className="modern-card">
                      <h3 className="text-3xl font-black mb-8 flex items-center gradient-text">
                        <Palette className="mr-4 h-8 w-8 text-primary" />
                        Appearance & Theme
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[
                          { id: "light", icon: Sun, label: "Light Mode", desc: "Clean and bright", gradient: "from-yellow-400 to-orange-500" },
                          { id: "dark", icon: Moon, label: "Dark Mode", desc: "Easy on the eyes", gradient: "from-purple-500 to-blue-600" },
                          { id: "system", icon: Monitor, label: "Auto", desc: "Follows system", gradient: "from-green-400 to-cyan-500" }
                        ].map((themeOption) => {
                          const Icon = themeOption.icon;
                          return (
                            <button
                              key={themeOption.id}
                              onClick={() => setTheme(themeOption.id)}
                              className={`relative p-8 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 group ${
                                theme === themeOption.id 
                                  ? 'glass-morphism border-primary/70 shadow-2xl shadow-primary/30' 
                                  : 'glass-morphism border-white/20 hover:border-primary/40'
                              }`}
                            >
                              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${themeOption.gradient} mx-auto mb-4 flex items-center justify-center shadow-xl group-hover:animate-float`}>
                                <Icon className="h-8 w-8 text-white" />
                              </div>
                              <h4 className="font-bold text-xl text-white mb-2">{themeOption.label}</h4>
                              <p className="text-white/60 text-sm">{themeOption.desc}</p>
                              {theme === themeOption.id && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Performance & Features */}
                    <div className="modern-card">
                      <h3 className="text-3xl font-black mb-8 flex items-center gradient-text">
                        <Zap className="mr-4 h-8 w-8 text-accent animate-pulse" />
                        Performance & Features
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { 
                            icon: Save, 
                            label: "Auto Save", 
                            desc: "Automatically save your progress",
                            checked: autoSave, 
                            onChange: setAutoSave,
                            gradient: "from-blue-500 to-cyan-500"
                          },
                          { 
                            icon: Zap, 
                            label: "Sound Effects", 
                            desc: "Enable immersive audio feedback",
                            checked: soundEffects, 
                            onChange: setSoundEffects,
                            gradient: "from-purple-500 to-pink-500"
                          }
                        ].map((setting, i) => {
                          const Icon = setting.icon;
                          return (
                            <div key={i} className="glass-morphism p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300 group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${setting.gradient} shadow-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-lg text-white">{setting.label}</span>
                                    <p className="text-white/60 text-sm">{setting.desc}</p>
                                  </div>
                                </div>
                                <Switch 
                                  checked={setting.checked} 
                                  onCheckedChange={setting.onChange}
                                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-accent scale-125"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Privacy & Security */}
                    <div className="modern-card">
                      <h3 className="text-3xl font-black mb-8 flex items-center gradient-text">
                        <Shield className="mr-4 h-8 w-8 text-green-400 animate-pulse" />
                        Privacy & Security
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {[
                          { 
                            icon: Bell, 
                            label: "Push Notifications", 
                            desc: "Get notified about quiz updates and achievements",
                            checked: notificationsEnabled, 
                            onChange: setNotificationsEnabled,
                            gradient: "from-orange-500 to-red-500"
                          },
                          { 
                            icon: privacyMode ? EyeOff : Eye, 
                            label: "Privacy Mode", 
                            desc: "Hide personal information and scores",
                            checked: privacyMode, 
                            onChange: setPrivacyMode,
                            gradient: "from-emerald-500 to-teal-500"
                          }
                        ].map((setting, i) => {
                          const Icon = setting.icon;
                          return (
                            <div key={i} className="glass-morphism p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${setting.gradient} shadow-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-lg text-white">{setting.label}</span>
                                    <p className="text-white/60 text-sm">{setting.desc}</p>
                                  </div>
                                </div>
                                <Switch 
                                  checked={setting.checked} 
                                  onCheckedChange={setting.onChange}
                                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-400 data-[state=checked]:to-emerald-400 scale-125"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Language Selection */}
                      <div className="glass-morphism p-6 rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                              <Monitor className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-lg text-white">Language</span>
                              <p className="text-white/60 text-sm">Choose your preferred language</p>
                            </div>
                          </div>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-48 glass-morphism border-white/20 text-white rounded-xl h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-morphism border-white/20 rounded-xl">
                              <SelectItem value="en">🇺🇸 English</SelectItem>
                              <SelectItem value="es">🇪🇸 Español</SelectItem>
                              <SelectItem value="fr">🇫🇷 Français</SelectItem>
                              <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowSettings(false)}
                        className="px-8 py-4 rounded-2xl font-bold glass-morphism border-white/30 text-white hover:border-white/50 hover:bg-white/5 transition-all duration-300"
                      >
                        Cancel
                      </Button>
                      <button
                        onClick={applySettings}
                        className="btn-modern relative group shadow-2xl"
                      >
                        <div className="flex items-center space-x-3">
                          <Save className="h-5 w-5" />
                          <span>Apply Settings</span>
                          <Sparkles className="h-5 w-5 animate-sparkle" />
                        </div>
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-3 glass-morphism px-4 py-2 rounded-xl border border-white/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.username?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-white font-semibold" data-testid="text-username">
                  {user?.username}
                </span>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
                className="glass-morphism border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 rounded-xl p-3 transition-all duration-300 hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Navigation */}
      {isMobile && (
        <div className="mobile-nav">
          <div className="flex justify-around py-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`mobile-nav-item group ${
                  currentSection === item.key ? "active" : ""
                }`}
                onClick={() => onSectionChange(item.key)}
                data-testid={`mobile-nav-${item.key}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-2 shadow-lg group-hover:animate-float`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
