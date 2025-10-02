// hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import { userProfile } from "@/services/serviceApis";

export interface DecodedToken {
  id: string;
  customer?: string;
  designation: string;
  exp: number;
}


export interface UserProfileResponse {
  success: boolean;
  user: DecodedToken;
}

export const useAuth = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserProfileResponse>({
    queryKey: ["userProfile"],
    queryFn: userProfile,
    // optional: don't automatically refetch on window focus
    refetchOnWindowFocus: false,
  });


    // const user = data?.user ?? null;


  return {
    user: data?.user,
    isLoggedIn: !!data,
    isLoading,
    isError,
    refetch,
  };
};
