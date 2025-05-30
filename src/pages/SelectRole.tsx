
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setActiveRole, isAuthenticated, getActiveRole, hasCompletedOnboarding } from "@/utils/auth";
import { Role } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, User, Building, LogOut } from "lucide-react";

const SelectRole = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleRoleSelect = async (role: Role) => {
    setIsLoading(true);
    setActiveRole(role);
    
    try {
      // Check if user has completed onboarding for this role
      const completed = await hasCompletedOnboarding(role);
      
      if (!completed && role !== 'homeowner') {
        // Redirect to onboarding if not completed (except for homeowner)
        navigate(`/onboarding/${role}`);
      } else {
        // Redirect to dashboard
        navigate(`/dashboard/${role}`);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const roleCards = [
    {
      id: "homeowner",
      title: "Homeowner",
      description: "Find and book professionals for your projects",
      icon: <Home className="h-12 w-12 mb-4 text-skillink-primary" />,
      color: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      id: "professional",
      title: "Professional",
      description: "Offer your services to homeowners",
      icon: <User className="h-12 w-12 mb-4 text-skillink-secondary" />,
      color: "bg-gradient-to-br from-purple-50 to-purple-100"
    },
    {
      id: "vendor",
      title: "Vendor",
      description: "Sell materials and supplies to professionals",
      icon: <Building className="h-12 w-12 mb-4 text-skillink-accent" />,
      color: "bg-gradient-to-br from-orange-50 to-orange-100"
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-skillink-light">
      <div className="w-full max-w-4xl p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-skillink-secondary mb-2">
            Welcome to Skillink 24/7
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Select your role to continue to your personalized dashboard experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleCards.map((card) => (
            <Card key={card.id} className={`overflow-hidden ${card.color} border-0 hover:shadow-lg transition-shadow duration-300`}>
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center">{card.icon}</div>
                <CardTitle className="text-xl text-skillink-dark">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm min-h-[40px]">
                  {card.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full bg-white text-skillink-primary hover:bg-gray-100 border border-skillink-primary/20"
                  onClick={() => handleRoleSelect(card.id as Role)}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : `Continue as ${card.title}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
