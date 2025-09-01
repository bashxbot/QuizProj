
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Brain, Menu, LogOut, Settings, Sparkles, Moon, Sun, Monitor, Bell, Shield, Palette, Save, Eye, EyeOff, Zap } from "lucide-react";
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
    { key: "dashboard" as const, label: "Dashboard", icon: "fas fa-tachometer-alt" },
    { key: "quiz" as const, label: "Take Quiz", icon: "fas fa-play-circle" },
    { key: "leaderboard" as const, label: "Leaderboard", icon: "fas fa-trophy" },
    { key: "profile" as const, label: "Profile", icon: "fas fa-user" },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-semibold text-foreground">QuizMaster Pro</span>
              </div>
            </div>
            
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    className={`nav-item flex items-center ${
                      currentSection === item.key ? "active" : ""
                    }`}
                    onClick={() => onSectionChange(item.key)}
                    data-testid={`nav-${item.key}`}
                  >
                    <i className={`${item.icon} mr-2`}></i>
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4">
              {/* Settings Dialog */}
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative group overflow-hidden glass-morphism border border-primary/20 hover:border-primary/40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Settings className="h-4 w-4 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                    <Sparkles className="ml-2 h-3 w-3 animate-sparkle" />
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

                    {/* Preferences Section */}
                    <div className="glass-morphism p-6 rounded-2xl border border-primary/10">
                      <h3 className="text-2xl font-bold mb-6 flex items-center text-foreground">
                        <Zap className="mr-3 h-6 w-6 text-accent" />
                        Performance & Features
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { 
                            icon: Save, 
                            label: "Auto Save", 
                            desc: "Automatically save progress",
                            checked: autoSave, 
                            onChange: setAutoSave 
                          },
                          { 
                            icon: Zap, 
                            label: "Sound Effects", 
                            desc: "Enable audio feedback",
                            checked: soundEffects, 
                            onChange: setSoundEffects 
                          }
                        ].map((setting, i) => {
                          const Icon = setting.icon;
                          return (
                            <div key={i} className="glass-effect p-4 rounded-xl border border-primary/10 hover:border-primary/20 transition-all duration-300 group">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
                                    <Icon className="h-5 w-5 text-accent" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-foreground">{setting.label}</span>
                                    <p className="text-sm text-muted-foreground">{setting.desc}</p>
                                  </div>
                                </div>
                                <Switch 
                                  checked={setting.checked} 
                                  onCheckedChange={setting.onChange}
                                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-accent data-[state=checked]:to-primary"
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
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                              <Monitor className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                              <span className="font-semibold text-foreground">Language</span>
                              <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                            </div>
                          </div>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-40 glass-effect">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
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
                        className="px-8 py-3 rounded-xl font-semibold glass-morphism"
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

              <span className="text-sm text-muted-foreground hidden sm:block" data-testid="text-username">
                {user?.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
                className="text-destructive hover:text-destructive/80 glass-morphism border border-red-500/20 hover:border-red-500/40"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="md:hidden glass-morphism border-t border-primary/20 backdrop-blur-xl">
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                  currentSection === item.key 
                    ? "text-primary bg-gradient-to-b from-primary/10 to-accent/10" 
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => onSectionChange(item.key)}
                data-testid={`mobile-nav-${item.key}`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
