export type FeeType = "FREE" | "PAID";

export type Category = {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  feeType: FeeType;
  feeAmount: string | null;
  slaHours: number;
  isActive: boolean;
  departmentId: string;
  createdAt: string;
  deletedAt?: string | null;
  department?: { id: string; name: string };
};

export type CreateCategoryPayload = {
  departmentId: string;
  name: string;
  description?: string;
  images?: string[];
  feeType: FeeType;
  feeAmount?: number;
  slaHours: number;
};

export type UpdateCategoryPayload = Partial<
  Omit<CreateCategoryPayload, "departmentId">
> & {
  isActive?: boolean;
};
