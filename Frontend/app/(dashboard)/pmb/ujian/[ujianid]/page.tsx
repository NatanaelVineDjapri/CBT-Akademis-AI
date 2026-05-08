"use client";
import ExamShell from "@/components/ujian/ExamShell";

interface Props {
  params: { ujianId: string };
}

export default function UjianAktifPage({ params }: Props) {
  return <ExamShell ujianId={params.ujianId} />;
}