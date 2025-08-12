import { useState } from "react";
import { z } from "zod";

export const useFieldValidator = (schema: z.ZodObject<any>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (fieldName: string, value: any) => {
    try {
      schema.pick({ [fieldName]: true }).parse({ [fieldName]: value });

      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: err.issues[0]?.message || "",
        }));
      }
    }
  };

  return { errors, validateField, setErrors };
};
