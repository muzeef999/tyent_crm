interface AxiosErrorShape {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  // Type narrowing instead of `as any`
  if (isAxiosErrorShape(error)) {
    return error.response?.data?.message ?? "Unexpected Axios error";
  }

  return "Something went wrong!";
}

// Type guard function — this replaces `as any`
function isAxiosErrorShape(error: unknown): error is AxiosErrorShape {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as Record<string, unknown>).response === "object"
  );
}
