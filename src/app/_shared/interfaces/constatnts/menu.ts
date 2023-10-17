import { Role } from "src/app/Models";

export interface Menu {
    title: string;
    path: string;
    active: boolean;
    enabled: boolean;
    roles: string[];
  }
export const MENUS: Menu[] = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      active: true,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Teacher Management",
      path: "/admin/teacher-management",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Student Management",
      path: "/admin/student-management",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Event Management",
      path: "/admin/event-management",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Resource Library",
      path: "/admin/resource-library",
      active: true,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Subjects",
      path: "/admin/subjects",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Menus",
      path: "/admin/menus",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Approvals",
      path: "/admin/approvals",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Test Papers",
      path: "/admin/testpapers",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Test Results",
      path: "/admin/results",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Assign",
      path: "/admin/assign",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Exam Types",
      path: "/admin/examtypes",
      active: false,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "My Profile",
      path: "/smart-tutor/profile",
      active: false,
      enabled: true,
      roles: [Role.TUTOR]
    },
    {
      title: "Event Management",
      path: "/smart-tutor/event-management",
      active: false,
      enabled: true,
      roles: [Role.TUTOR]
    },
    {
      title: "Resource Library",
      path: "/smart-tutor/resource-library",
      active: true,
      enabled: true,
      roles: [Role.TUTOR]
    },
    {
      title: "Test Papers",
      path: "/admin/testpapers",
      active: false,
      enabled: true,
      roles: [Role.TUTOR]
    },
    {
      title: "Test Results",
      path: "/admin/results",
      active: false,
      enabled: true,
      roles: [Role.TUTOR]
    },
    {
      title: "Assign",
      path: "/smart-tutor/assign",
      active: false,
      enabled: true,
      roles: [Role.TUTOR]
    },
    {
      title: "Troubles",
      path: "/smart-tutor/troubles",
      active: true,
      enabled: true,
      roles: [Role.TUTOR]
    },
    {
      title: "Pricing",
      path: "",
      active: false,
      enabled: false,
      roles: [Role.ADMIN]
    },
    {
      title: "Orders",
      path: "/admin/orders",
      active: true,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Troubles",
      path: "/admin/troubles",
      active: true,
      enabled: true,
      roles: [Role.ADMIN]
    },
    {
      title: "Payments",
      path: "",
      active: false,
      enabled: false,
      roles: [Role.ADMIN]
    },
    {
      title: "My Profile",
      path: "",
      active: false,
      enabled: false,
      roles: [Role.ADMIN]
    },
    {
      title: "Home",
      path: "/smart-student/stud_Home",
      active: true,
      enabled: true,
      roles: [Role.STUDENT]
    },
    {
      title: "Profile",
      path: "/smart-student/profile",
      active: true,
      enabled: true,
      roles: [Role.STUDENT]
    },
    {
      title: "Dashboard",
      path: "/smart-student/stud_Dashboad",
      active: true,
      enabled: true,
      roles: [Role.STUDENT]
    },
    {
      title: "Events",
      path: "/smart-student/events",
      active: true,
      enabled: true,
      roles: [Role.STUDENT]
    },
    {
      title: "Test Papers",
      path: "/smart-student/results",
      active: true,
      enabled: true,
      roles: [Role.STUDENT]
    },
    {
      title: "Orders",
      path: "/smart-student/orders",
      active: true,
      enabled: true,
      roles: [Role.STUDENT]
    },
    {
      title: "Troubles",
      path: "/smart-student/troubles",
      active: true,
      enabled: true,
      roles: [Role.STUDENT]
    },
    {
      title: "Payment-Method",
      path: "/smart-student/payment-method",
      active: true,
      enabled: true,
      roles: [Role.STUDENT]
    },
    {
      title: "Order-history",
      path: "/smart-student/order-history",
      active: true,
      enabled: true,
      roles: [Role.STUDENT]
    },
 
    // {
    //   title: "Resource Library",
    //   path: "/smart-student/resource-library",
    //   active: true,
    //   enabled: true,
    //   roles: [Role.STUDENT]
    // },
  ];