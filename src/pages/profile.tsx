import Header from "@/components/header";
import { useAuth } from "@/store/auth";

export default function Profile() {
  const user = useAuth((state) => state.user);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex justify-center bg-gradient-to-br from-green-100 pt-8 via-white to-yellow-100">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Личный кабинет
          </h2>
          <div className="flex justify-center items-center min-h-[150px]">
            {user ? (
              <div className="text-center">
                Привет, {user?.name}
              </div>
            ) : (
              <div className="hidden"></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
