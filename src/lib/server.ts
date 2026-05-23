// Re-export from Supabase queries — this file exists for backwards compatibility
export type { Subject as SubjectDetail, Material } from "./supabase/queries";
export {
    getSubjects,
    getSubjectDetails,
    searchSubjects,
} from "./supabase/queries";
