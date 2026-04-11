export const Role = {
    ADMIN: "ADMIN",
    TUTOR: "TUTOR",
    STUDENT: "STUDENT",
}

export type RoleType = typeof Role[keyof typeof Role];