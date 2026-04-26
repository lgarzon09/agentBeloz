import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FitoAgent } from "@/components/fito-agent";
import { InterviewerAgent } from "@/components/interviewer-agent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1 mx-auto w-full max-w-[1100px] px-6 py-10">
        <Tabs defaultValue="fito">
          <TabsList variant="line" className="mb-8">
            <TabsTrigger
              value="fito"
              className="data-active:text-brand-navy data-active:after:bg-brand-gold text-brand-muted px-4 py-2 text-sm font-medium cursor-pointer"
            >
              Fito - Post-recharge Upsell
            </TabsTrigger>
            <TabsTrigger
              value="interviewer"
              className="data-active:text-brand-navy data-active:after:bg-brand-gold text-brand-muted px-4 py-2 text-sm font-medium cursor-pointer"
            >
              Discovery Interviewer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fito">
            <FitoAgent />
          </TabsContent>

          <TabsContent value="interviewer">
            <InterviewerAgent />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </>
  );
}
