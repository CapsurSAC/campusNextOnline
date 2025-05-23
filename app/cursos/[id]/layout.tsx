import CursoBreadcrumb from '@/components/CursoBreadcrumb';

export default function CursoLayout({ children, params }: { children: React.ReactNode; params: { id: string } }) {
  return (
    <div className="p-4">
      <CursoBreadcrumb />
      {children}
    </div>
  );
}
