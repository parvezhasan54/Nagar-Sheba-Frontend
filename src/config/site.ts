export type SocialLabel = "GitHub" | "Facebook" | "LinkedIn";

export const SITE = {
  name: "Nagar Sheba",
  address: "Agrabad Commercial Area, Chattogram, Bangladesh",
  email: "parvezyesrat17032024@gmail.com",
  phone: "+880 18-76097788",
  phoneHref: "tel:+8801876097788",
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/parety308/Nagar-Sheba-Frontend",
    },
    { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "" },
    { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "" },
  ] satisfies { label: SocialLabel; href: string }[],
};