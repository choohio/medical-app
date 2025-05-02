import Header from "@/components/header";
import { GetServerSideProps } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { User } from "../types/user";
import { useAuth } from "@/store/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookieHeader = ctx.req.headers.cookie;

  if (!cookieHeader) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const cookies = parse(cookieHeader);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return {
      props: {
        user,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default function Profile() {
  const user = useAuth((state) => state.user);

  return (
    <div>
      <Header />
      <div className="flex justify-center h-screen pt-20">
        {user ? <h1 className="text-center">Привет, {user?.name}</h1> : <div className="hidden"></div>}
      </div>
    </div>
  );
}
