import { redirect } from "next/navigation";

export default function TutorProfileDetailsPage({ params }: { params: { id: string } }) {
  redirect(`/tutors/${params.id}`);
}