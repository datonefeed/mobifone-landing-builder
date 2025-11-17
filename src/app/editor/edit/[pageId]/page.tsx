import { LandingPageEditor } from "@/components/editor/LandingPageEditor";

interface PageProps {
  params: {
    pageId: string;
  };
}

export default function EditPage({ params }: PageProps) {
  return <LandingPageEditor pageId={params.pageId} />;
}
