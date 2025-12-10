export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  contentPoints: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Partner {
  name: string;
  logo: string;
  url: string;
}
