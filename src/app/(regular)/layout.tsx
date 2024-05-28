import Footer from "@/components/footer/Footer";
import Categories from "@/components/navbar/Categories";
import Navbar from "@/components/navbar/Navbar";


export default function CreationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Categories />
      <main className="bg-white m-auto px-2 text-center max-w-screen-lg  mt-4 flex justify-center items-center">
        {children}
      </main>
      <Footer />
    </>
  );
}
