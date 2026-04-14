import FooterPage from "@/components/module/Fooder/fooder";
import Navbar from "@/components/shared/Navbar/Navbar";


export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <FooterPage />
    </div>
  );
}
