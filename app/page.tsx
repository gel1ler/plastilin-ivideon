import Clients from "@/components/clients/clients";
import Create from "@/components/create";
import Header from "@/components/header";
import { getClients } from "@/firebase/clientApp";
import { ClientData } from "@/types";
import { Typography } from "@mui/material";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const clients: ClientData[] = await getClients()

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-4 max-w-screen-sm mx-auto relative gap-10">
        <Header />
        <Clients clients={clients} />
        <Create />
      </main>
    </>
  );
}
