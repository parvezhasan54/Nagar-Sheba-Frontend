
import {
  CreditCard,
  FilePlus,
  type LucideIcon,
  RotateCcw,
  Timer,
} from "lucide-react";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  sections: { heading: string; body: string[] }[];
};

export const POSTS: BlogPost[] = [
  {
    slug: "file-a-request-that-gets-resolved-faster",
    title: "How to file a request that gets resolved faster",
    excerpt:
      "Four details that help the right team find the problem and fix it on the first visit.",
    category: "Guides",
    date: "2026-10-03",
    readMinutes: 3,
    icon: FilePlus,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Smartphone used to submit a civic service request",
    sections: [
      {
        heading: "Choose the right service",
        body: [
          "Services are grouped by department, and each one shows its fee and resolution time before you commit. Picking the exact service, for example Streetlight Outage instead of a general road complaint, sends your request straight to the team that handles it.",
        ],
      },
      {
        heading: "Be specific in the title and description",
        body: [
          'A title such as "Deep pothole near Agrabad bus stop" tells a crew more than "Road problem". In the description, say what happened, since when, and how it affects people. Descriptions need at least 20 characters, but a few clear sentences work best.',
        ],
      },
      {
        heading: "Pin the exact location",
        body: [
          "Use the Use my location button when you are at the site, or enter the latitude and longitude manually. A live map preview confirms the pin before you submit, so the crew does not have to guess which street you meant.",
        ],
      },
      {
        heading: "Add photos",
        body: [
          "You can attach up to 5 photos of 5 MB each. Photos are optional, but they let crews bring the right tools. After you submit, keep your tracking reference, which looks like NS-2026-000001, to follow every status change.",
        ],
      },
    ],
  },
  {
    slug: "understanding-service-deadlines",
    title: "Understanding service deadlines and overdue requests",
    excerpt:
      "How the resolution clock works, what the times are, and what happens when a deadline is missed.",
    category: "Transparency",
    date: "2026-10-06",
    readMinutes: 3,
    icon: Timer,
    image:
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Clock representing service deadlines and resolution times",
    sections: [
      {
        heading: "When the clock starts",
        body: [
          "Each service has a resolution time. The clock starts when your request is assigned to a staff member, not when you file it. The deadline then appears on your request as Due by.",
        ],
      },
      {
        heading: "How long each service takes",
        body: [
          "Times differ by service. Dead animal removal is targeted within 12 hours. Missed garbage collection, water leakage and sewage overflow are targeted within 24 hours. A pothole repair is 72 hours, and a trade licence renewal is 7 days.",
        ],
      },
      {
        heading: "What happens when a deadline passes",
        body: [
          "A background job checks open requests regularly and flags any that pass their deadline. Flagged requests show an Overdue badge, and administrators can filter for them and reassign the work.",
        ],
      },
      {
        heading: "What the deadline means",
        body: [
          "Target times are commitments the system tracks, not guarantees of outcome. They exist so that every request has an owner and a visible clock.",
        ],
      },
    ],
  },
  {
    slug: "paying-for-permits-and-refunds",
    title: "Paying for permits: SSLCommerz, bKash and refunds",
    excerpt:
      "Which services have a fee, how payment works, and what happens if you cancel or a payment fails.",
    category: "Payments",
    date: "2026-10-09",
    readMinutes: 4,
    icon: CreditCard,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Customer making a digital payment at checkout",
    sections: [
      {
        heading: "Which services are paid",
        body: [
          "Complaints such as potholes, streetlights and garbage collection are free. Permits carry a fee: Tree Cutting Permit BDT 500, Noise Permit BDT 800, Street Vending Permit BDT 600, Signboard Permit BDT 1,200, Trade Licence Renewal BDT 1,500 and Road Cutting Permit BDT 2,500.",
        ],
      },
      {
        heading: "How to pay",
        body: [
          "After you submit a paid request you are taken to SSLCommerz to pay. You can also choose bKash from the request page. Your request moves from Pending Payment to Submitted as soon as the gateway payment is verified, and a PDF receipt is emailed to you and kept under Payments.",
        ],
      },
      {
        heading: "If a payment fails or is cancelled",
        body: [
          "Your request stays in Pending Payment, so nothing is lost. Open the request and start a new payment session whenever you are ready.",
        ],
      },
      {
        heading: "Cancelling and refunds",
        body: [
          "You can cancel while a request is Pending Payment, Submitted or Assigned. A completed payment is refunded automatically to the original payment method. If an automatic refund fails, an administrator can retry it from the payments page.",
        ],
      },
    ],
  },
  {
    slug: "not-fixed-how-reopening-works",
    title: "Not fixed properly? How reopening works",
    excerpt:
      "You have 3 days after a request is resolved to send it back, and to rate the result.",
    category: "Guides",
    date: "2026-10-12",
    readMinutes: 3,
    icon: RotateCcw,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Maintenance workers repairing a road or public infrastructure",
    sections: [
      {
        heading: "The 3-day window",
        body: [
          "When staff mark your request Resolved, you have 3 days to check the work. If the problem is still there, open the request and choose Reopen request.",
        ],
      },
      {
        heading: "What happens when you reopen",
        body: [
          "You write a short reason, at least 5 characters, saying what is still wrong. The request returns to Assigned, the assigned staff member is notified, and the service deadline starts again.",
        ],
      },
      {
        heading: "If you do nothing",
        body: [
          "After 3 days without action the request closes automatically. A closed request cannot be reopened, so file a new request if the problem comes back.",
        ],
      },
      {
        heading: "Rate the result",
        body: [
          "Once a request is resolved or closed you can leave one rating from 1 to 5 stars with an optional comment. Ratings appear on the service page with first names only, and they help others judge each service.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
