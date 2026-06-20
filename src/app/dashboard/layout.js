import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      <aside className="w-64 border-r bg-background p-4">
        <Sidebar />
      </aside>


      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}