export type UserRole = "ADMIN" | "TUTOR" | "STUDENT";

export const authRoutes = [ "/login", "/register", "/forgot-password", "/reset-password", "/verify-email" ];

export const isAuthRoute = (pathname : string) => {
    return authRoutes.some((router : string) => router === pathname);
}

export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
}

export const commonProtectedRoutes : RouteConfig = {
    exact : ["/my-profile", "/change-password"],
    pattern : []
}

export const tutorProtectedRoutes : RouteConfig = {
    pattern: [/^\/tutor(\/.*)?$/],
    exact : []
}

export const adminProtectedRoutes : RouteConfig = {
    pattern: [/^\/admin(\/.*)?$/],
    exact : []
}

export const studentProtectedRoutes : RouteConfig = {
    pattern: [/^\/student(\/.*)?$/],
    exact : []
};

export const dashboardProtectedRoutes : RouteConfig = {
    pattern: [/^\/dashboard(\/.*)?$/],
    exact : ["/payment/success"]
};

export const isRouteMatches = (pathname : string, routes : RouteConfig) => {
    if(routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern : RegExp) => pattern.test(pathname));
}

export const getRouteOwner = (pathname : string) :  "ADMIN" | "TUTOR" | "STUDENT" | "COMMON" | null => {
    if(isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }

    if(isRouteMatches(pathname, tutorProtectedRoutes)) {
        return "TUTOR";
    }

    if(isRouteMatches(pathname, studentProtectedRoutes)) {
        return "STUDENT";
    }

    if(isRouteMatches(pathname, dashboardProtectedRoutes)) {
        return "COMMON";
    }

    if(isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
}

export const getDefaultDashboardRoute = (role : UserRole) => {
    void role;
    // With parallel routes all roles land on /dashboard.
    return "/dashboard";
}

export const isValidRedirectForRole = (redirectPath : string, role : UserRole) => {
    const routeOwner = getRouteOwner(redirectPath);

    if(routeOwner === null || routeOwner === "COMMON"){
        return true;
    }

    if(routeOwner === role){
        return true;
    }

    return false;
}