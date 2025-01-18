import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  List,
  Database,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Articles",
    url: "/admin",
    icon: FileText,
  },
  {
    title: "Catégories",
    url: "/admin?tab=categories",
    icon: List,
  },
  {
    title: "Sous-catégories",
    url: "/admin?tab=subcategories",
    icon: Database,
  },
  {
    title: "Bannières",
    url: "/admin?tab=banner",
    icon: LayoutDashboard,
  },
  {
    title: "Bannière Verticale",
    url: "/admin?tab=vertical-banner",
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}