"use client"
import Button from "@/components/ui/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UnauthorizedPage() {


  const router = useRouter();


  const handleLogout = async() => {
   try {
      await axios.post("/api/auth/me");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Error logging out. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to view this page.
      </p>


      <Button type="submit" variant="primary" onClick={handleLogout}>
        Login
      </Button>
     
    </div>
  );
}
