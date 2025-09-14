import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowLeft,
  AlertCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { signup } from "@/lib/functions";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  // const { register, isLoading } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Auto-fill from saved guest info or signup prefill
  React.useEffect(() => {
    const loadSavedInfo = () => {
      const signupPrefill = localStorage.getItem('nutri_signup_prefill');
      const guestInfo = localStorage.getItem('nutri_guest_info');
      
      let savedData = null;
      if (signupPrefill) {
        savedData = JSON.parse(signupPrefill);
        localStorage.removeItem('nutri_signup_prefill'); // Remove after use
      } else if (guestInfo) {
        savedData = JSON.parse(guestInfo);
      }
      
      if (savedData) {
        setFormData(prev => ({
          ...prev,
          firstName: savedData.firstName || prev.firstName,
          lastName: savedData.lastName || prev.lastName,
          email: savedData.email || prev.email,
          phone: savedData.phone || prev.phone
        }));
      }
    };
    
    loadSavedInfo();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[0-9\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      const response = await signup(userData);

      if (response.success) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to O2 Nutrition! You can now start shopping.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Registration failed",
          description:
            response.error ||
            "Email might already be in use. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Bodybuilder Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-white hover:text-[#F9A245] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Register Card */}
          <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </CardTitle>
              <p className="text-gray-600">
                Join O2 Nutrition and start your fitness journey
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-gray-700 font-medium"
                    >
                      First Name
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`pl-10 h-12 focus:ring-[#F9A245] focus:border-[#F9A245] ${
                          errors.firstName ? "border-red-500" : ""
                        }`}
                        required
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-gray-700 font-medium"
                    >
                      Last Name
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`pl-10 h-12 focus:ring-[#F9A245] focus:border-[#F9A245] ${
                          errors.lastName ? "border-red-500" : ""
                        }`}
                        required
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`pl-10 h-12 focus:ring-[#F9A245] focus:border-[#F9A245] ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={`pl-10 h-12 focus:ring-[#F9A245] focus:border-[#F9A245] ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      required
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`pl-10 pr-10 h-12 focus:ring-[#F9A245] focus:border-[#F9A245] ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`pl-10 pr-10 h-12 focus:ring-[#F9A245] focus:border-[#F9A245] ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 rounded border-gray-300 text-[#F9A245] focus:ring-[#F9A245]"
                    />
                    <label className="text-sm text-gray-600 leading-5">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-[#F9A245] hover:text-[#e8913d] font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy-policy"
                        className="text-[#F9A245] hover:text-[#e8913d] font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.terms}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-[#F9A245] hover:bg-[#e8913d] text-white font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#F9A245] hover:text-[#e8913d] font-semibold"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
