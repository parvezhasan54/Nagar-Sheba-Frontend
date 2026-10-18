export type PublicStats = {
  totalRequests: number;
  resolvedRequests: number;
  departments: number;
  categories: number;
  averageRating: number | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ResolvedIssue = {
  id: string;
  title: string;
  category: string;
  department: string;
  area: string;
  resolvedAt: string;
  hoursToResolve: number;
};

export type Testimonial = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: string;
  service: string;
};
