
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Brain, Mail, Lock, User, Eye, EyeOff, Sparkles, Crown, Star, Zap } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { loginMutation, registerMutation } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (isLogin) {
      loginMutation.mutate({
        username: formData.username,
        password: formData.password,
      });
    } else {
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: "Passwords don't match" });
        return;
      }
      registerMutation.mutate({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="page-container">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/25 animate-pulse-glow mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Crown className="h-5 w-5 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-black gradient-text mb-4">QuizMaster</h1>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pro</p>
            <p className="text-white/70 text-lg mt-4">
              {isLogin ? "Welcome back! Sign in to continue your learning journey." : "Join thousands of learners worldwide!"}
            </p>
          </div>

          {/* Auth Form */}
          <div className="modern-card">
            {/* Tab Toggle */}
            <div className="flex mb-8 glass-morphism rounded-2xl p-2 border border-white/20">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                  isLogin 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <User className="h-5 w-5 mr-2 inline" />
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Star className="h-5 w-5 mr-2 inline" />
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="form-group">
                <label className="form-label">
                  <User className="h-4 w-4 mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => updateFormData("username", e.target.value)}
                  className="input-modern"
                  placeholder="Enter your username"
                  required
                />
                {errors.username && (
                  <div className="form-error">
                    <Eye className="h-4 w-4 mr-2" />
                    {errors.username}
                  </div>
                )}
              </div>

              {/* Email Field (Register Only) */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="input-modern"
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && (
                    <div className="form-error">
                      <Eye className="h-4 w-4 mr-2" />
                      {errors.email}
                    </div>
                  )}
                </div>
              )}

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="input-modern pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="form-error">
                    <Eye className="h-4 w-4 mr-2" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password (Register Only) */}
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">
                    <Lock className="h-4 w-4 mr-2" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      className="input-modern pr-12"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="form-error">
                      <Eye className="h-4 w-4 mr-2" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending || registerMutation.isPending}
                className="btn-modern w-full group mt-8"
              >
                {loginMutation.isPending || registerMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-3"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap className="h-5 w-5 mr-3 group-hover:animate-bounce" />
                    {isLogin ? "Sign In" : "Create Account"}
                    <Sparkles className="h-5 w-5 ml-3 animate-sparkle" />
                  </div>
                )}
              </button>
            </form>

            {/* Error Display */}
            {(loginMutation.error || registerMutation.error) && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
                <p className="text-red-400 text-sm font-medium">
                  {loginMutation.error?.message || registerMutation.error?.message}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm">
              Powered by AI • Secure • Fast
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
