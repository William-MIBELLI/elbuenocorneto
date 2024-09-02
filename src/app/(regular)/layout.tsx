import { auth } from "@/auth";
import Footer from "@/components/footer/Footer";
import Categories from "@/components/navbar/Categories";
import Navbar from "@/components/navbar/Navbar";


export default async  function CreationLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const session = await auth()
  return (
    <>
      <Navbar userId={session?.user?.id} />
      <Categories />
      <main className="bg-white m-auto px-2 text-center max-w-screen-lg  mt-4 flex justify-center items-center">
        {children}
      </main>
      <Footer />
    </>
  );
}
